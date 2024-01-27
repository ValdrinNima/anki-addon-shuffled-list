from aqt import mw, gui_hooks
from aqt.qt import *
from anki.hooks import addHook

from .consts import addon_path
from .html_parser import ULParser

import json
import os

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
    styling = f"""<style>[id^='{SHUFFLE_LIST_ID}-'] {{list-style-type: circle;}}</style>"""

    if context == "reviewAnswer" and prepare.shuffled_list_content:
        parser = ULParser(card, context, SHUFFLE_LIST_ID, shuffle_list_content=prepare.shuffled_list_content)
        parser.feed(html)
        return parser.result.getvalue() + styling

    parser = ULParser(card, context, SHUFFLE_LIST_ID)
    parser.feed(html)
    prepare.shuffled_list_content = parser.shuffled_list_content

    return parser.result.getvalue() + styling


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
