from aqt import mw, gui_hooks
from aqt.qt import *
from anki.hooks import addHook

from .consts import addon_path

import json
import re
import random

SHUFFLE_LIST_ID = "_shuffle-list"


def getConfig():
    return mw.addonManager.getConfig(__name__)


def shuffleList(editor):
    """Insert an unordered list from the selected text."""

    selected_text = editor.web.selectedText()

    list_items = ""
    for line in selected_text.splitlines():
        list_items += f"<li>{line}</li>"

    formatted_text = f"<ul id=\"{SHUFFLE_LIST_ID}-{str(shuffleList.counter).zfill(3)}\">{list_items}</ul>"
    shuffleList.counter += 1

    editor.web.eval(f"document.execCommand('inserthtml', false, {json.dumps(formatted_text)});")


shuffleList.counter = 0


def prepare(html, card, context):
    unordered_list_re = re.compile(fr'(?<=<ul id="{SHUFFLE_LIST_ID}">)([\s\S]*?)(?=</ul>)')
    list_item_re = re.compile(r'(?<=<li>)(.*?)(?=</li>)')

    styling = f"""<style>[id^='{SHUFFLE_LIST_ID}-'] {{list-style-type: circle;}}</style>"""

    if not context == "reviewQuestion":
        try:
            for index, shuffled_list_item in prepare.shuffled_list_items:
                unordered_list_re = re.compile(fr'(?<=<ul id="{SHUFFLE_LIST_ID}-{index}">)([\s\S]*?)(?=</ul>)')
                unordered_list = unordered_list_re.findall(html)[0]
                html = unordered_list_re.sub(shuffled_list_item, html)

            return html + styling
        except:
            return html

    all_unordered_list_re = re.compile(fr'<ul id="{SHUFFLE_LIST_ID}-\d\d\d">')

    all_unordered_list = "".join(all_unordered_list_re.findall(html))
    print(all_unordered_list)
    indices_re = re.compile(r'\d\d\d')
    indices = indices_re.findall(all_unordered_list)

    shuffled_list_items = []
    for index in indices:
        unordered_list_re = re.compile(fr'(?<=<ul id="{SHUFFLE_LIST_ID}-{index}">)([\s\S]*?)(?=</ul>)')
        unordered_list = unordered_list_re.findall(html)[0]

        list_item_values = list_item_re.findall(unordered_list)
        random.shuffle(list_item_values)
        shuffled_list_item = "".join([f"<li>{value}</li>" for value in list_item_values])
        shuffled_list_items.append((index, shuffled_list_item))

        html = unordered_list_re.sub(shuffled_list_item, html)

    # Add the shuffled list items as persistent data to the prepare function. This way, the list items can be accessed
    # in the next call of the prepare function, when the answer is shown (when the context is "reviewAnswer").
    prepare.shuffled_list_items = shuffled_list_items

    return html + styling


gui_hooks.card_will_show.append(prepare)


def onSetupButtons(buttons, editor):
    """Add buttons to Editor for Anki 2.1.x"""

    actions = getConfig().get("actions", None)

    if not actions:
        return buttons

    for action in actions:
        try:
            name = action["name"]
            tooltip = action["tooltip"]
            label = action.get("label", "")
            hotkey = action["hotkey"]
            method = globals().get(name)
        except KeyError:
            print("Shuffle List: Action not configured properly:", action)
            continue

        icon_path = os.path.join(addon_path, "icons", f"{name}.png")
        if not os.path.exists(icon_path):
            icon_path = ""

        btn = editor.addButton(icon_path, name, method,
                               tip="{} ({})".format(tooltip, hotkey),
                               label="" if icon_path else label,
                               keys=hotkey)

        buttons.append(btn)

    return buttons


addHook("setupEditorButtons", onSetupButtons)
