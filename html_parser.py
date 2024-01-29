from html.parser import HTMLParser
from io import StringIO
import random
import re


class ClozeHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = StringIO()
        self.in_cloze_span = False
        self.cloze_data = ""

    def handle_starttag(self, tag, attrs):
        if tag == 'span':
            attrs_dict = dict(attrs)
            if 'class' in attrs_dict and attrs_dict['class'] == 'cloze':
                # If it's the specific span, set the flag and store cloze data
                self.in_cloze_span = True
                self.cloze_data = attrs_dict.get('data-cloze', '')
                self.result.write(f'<{tag} ')
                for attr, value in attrs_dict.items():
                    self.result.write(f'{attr}="{value}" ')
                self.result.write('>')
            else:
                self.write_starttag(tag, attrs)
        else:
            self.write_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag == 'span' and self.in_cloze_span:
            # Close the cloze span and reset the flag
            self.result.write('</span>')
            self.in_cloze_span = False
        else:
            self.result.write(f'</{tag}>')

    def handle_data(self, data):
        if self.in_cloze_span:
            # Replace the placeholder with cloze data
            if data.strip() == "[...]":
                self.result.write(self.cloze_data)
            else:
                self.result.write(data)
        else:
            self.result.write(data)

    def write_starttag(self, tag, attrs):
        self.result.write(f'<{tag} ')
        for attr, value in attrs:
            self.result.write(f'{attr}="{value}" ')
        self.result.write('>')

    def get_data(self):
        return self.result.getvalue()


class ULParser(HTMLParser):
    def __init__(self, card, context, shuffle_list_id, shuffle_list_content=None):
        super().__init__()
        self.card = card
        self.context = context
        self.in_target_ul = False
        self.current_index = ''
        self.ul_buffer = StringIO()
        self.li_buffer = StringIO()
        self.result = StringIO()
        # shuffled_list_content is a dictionary that stores the shuffled list content for each list
        # Each list is identified by its index, which is the number after the dash in the list id
        if shuffle_list_content is None:
            shuffle_list_content = {}
        self.shuffled_list_content = shuffle_list_content
        self.shuffle_list_id = shuffle_list_id

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'ul':
            if 'id' in attrs and attrs['id'].startswith(self.shuffle_list_id):
                self.in_target_ul = True
                self.current_index = attrs['id'][len(self.shuffle_list_id) + 1:]  # +1 for the dash
                self.ul_buffer = StringIO()
                self.ul_buffer.write('<ul ')
                for attr, value in attrs.items():
                    self.ul_buffer.write(f'{attr}="{value}" ')
                self.ul_buffer.write('>')
        elif tag == 'li' and self.in_target_ul:
            self.li_buffer.write(f'<{tag}>')
        elif tag in ['u', 'i', 'b', 'strong', 'span'] and self.in_target_ul:
            self.li_buffer.write(f'<{tag} ')
            for attr, value in attrs.items():
                self.li_buffer.write(f'{attr}="{value}" ')
            self.li_buffer.write('>')
        else:
            self.result.write(f'<{tag} ')
            for attr, value in attrs.items():
                self.result.write(f'{attr}="{value}" ')
            self.result.write('>')

    def handle_endtag(self, tag):
        if tag == 'ul' and self.in_target_ul:
            # Split the buffer value into list items so that they can be shuffled
            list_items = self.li_buffer.getvalue().split('</li>')

            # If the context is "reviewAnswer" and the shuffled list content is already known, use it.
            # This way the list items won't be shuffled again when the answer is shown.
            if self.shuffled_list_content.get(self.current_index, None) and self.context == "reviewAnswer":
                self.ul_buffer.write(self.shuffled_list_content[self.current_index])
                # Replace ul buffer content with revealed cloze data
                ul_content = self.replace_cloze_placeholder()

                self.clear_buffer(self.li_buffer)
                self.clear_buffer(self.ul_buffer)

                # Write the content with the revealed cloze data to the buffer
                self.ul_buffer.write(ul_content)
                self.ul_buffer.write('</ul>')
                self.in_target_ul = False
                self.result.write(self.ul_buffer.getvalue())
                return

            # Strip whitespace and filter out empty strings, then shuffle the list
            cleaned_items = [item.strip() for item in list_items if item.strip()]
            random.shuffle(cleaned_items)

            # Join the shuffled items back into a string with '</li>' as the separator
            shuffled_content = '</li>'.join(cleaned_items)
            self.shuffled_list_content[self.current_index] = shuffled_content
            self.ul_buffer.write(shuffled_content)
            self.ul_buffer.write('</ul>')

            self.in_target_ul = False
            self.result.write(self.ul_buffer.getvalue())

            self.clear_buffer(self.li_buffer)
            self.clear_buffer(self.ul_buffer)
        elif tag == 'li' and self.in_target_ul:
            self.li_buffer.write(f'</{tag}>')
        elif tag in ['u', 'i', 'b', 'strong', 'span'] and self.in_target_ul:
            self.li_buffer.write(f'</{tag}>')
        else:
            self.result.write(f'</{tag}>')

    def replace_cloze_placeholder(self):
        cloze_replace_parser = ClozeHTMLParser()
        cloze_replace_parser.feed(self.ul_buffer.getvalue())
        return cloze_replace_parser.get_data()

    def handle_data(self, data):
        if self.in_target_ul:
            self.li_buffer.write(data)
        else:
            self.result.write(data)

    def clear_buffer(self, buffer):
        buffer.seek(0)
        buffer.truncate(0)
