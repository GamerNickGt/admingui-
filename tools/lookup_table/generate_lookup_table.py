#!/bin/env python3

import logging
import argparse
import json
import sys
from pathlib import Path

override_name_lookup = {
    "questionmark": "?",
    "arrow_left": "<",
}


def parse_arguments():
    parser = argparse.ArgumentParser(description="A script with adjustable logging levels.")
    parser.add_argument("--logging", type=str, default="info",
                        help="Set the logging level (debug, info, warning, error, critical)")
    parser.add_argument("--character", type=str)
    parser.add_argument("--unicode", type=str)

    return parser.parse_args()

def get_log_level(level_name):
    levels = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL
    }

    return levels.get(level_name.lower(), logging.INFO)

def override_list_name(sorted_files):
    # logging.debug(sorted_files)
    output = []
    for file in sorted_files:
        path = file
        original_name = file.name
        if original_name in override_name_lookup:
            newname = override_name_lookup[original_name]
            logging.debug("New name: %s", newname)
        else:
            newname = original_name
        output.append((path, newname))
    return output
    # override the actual character the list is used for. Special characters like "?", that cannot be a filename.
    # if file.name in symbol_lookup:
        # character = "A"
        # logging.debug("Overridden list: %s with %s", file.name, character)
    

def get_filelist(dir):
    dir_path = Path(dir)
    files = list(dir_path.rglob('*'))
    files = [f for f in files if f.is_file()]
    sorted_files = sorted(files, key=lambda x: x.name.lower())
    # output = [(file, file.name) for file in sorted_files]
    output = override_list_name(sorted_files)
    logging.debug(output)
    # sys.exit()
    return output


def increment_hex(hex_value):
    int_value = int(hex_value, 16)
    
    int_value += 1

    # Convert back to hexadecimal and return, removing the "0x" prefix
    return hex(int_value)[2:].upper()

def get_character_data(char=None, list=None, linenumber=None):
    result = convert_char_to_unicode(char=char, list=list, linenumber=linenumber)
    
    if result:
        print(result)
        data = [char, result]
    
    return data

def convert_unicode_to_char(unicode_str):
    # The input is expected to be in the format 'U+XXXX' or 'U+XXXXXXXX'
    unicode_value = int(unicode_str.replace('U+', ''), 16)
    
    char = chr(unicode_value)

    return char

def output_lookup_table(filepath, data):
    json_data = json.dumps(data, ensure_ascii=False, indent=4)
    
    with open(filepath, "w", encoding='utf-8') as file:
        file.write(str(json_data))

def load_input(file_path):
    logging.debug("Loading file: %s", file_path)
    with open(file_path, 'r') as file:
        data = [line.strip() for line in file if line.strip()]
        
        log_duplicate_lines(data=file, file=file_path)
        
    return data
    
def log_duplicate_lines(data, file):
    seen = set()
    for linenumber, line in enumerate(data, start=1):
        stripped_line = line.strip()
        if stripped_line in seen:
            logging.warning("Duplicate character %s on line %s in file %s", stripped_line, linenumber, file)
        seen.add(stripped_line)

def generate_lookup_table(input_dir):
    logging.info("Generating the lookup table")
    input_lists = get_filelist(f"{input_dir}")
    logging.debug("Found input lists: %s", input_lists)
    # sys.exit()
    lookup_table = {}
    
    for full_path, list in input_lists:
        logging.debug("Processing input list: %s", list)
        filepath = f"{full_path}"
        special_characters = load_input(filepath)
        logging.debug(special_characters)
        list_data = []
        for linenumber, character in enumerate(special_characters, start=1):
            character_data = get_character_data(char=character, list=full_path, linenumber=linenumber)
            list_data.append(character_data)
            logging.debug("Characer_data: %s", character_data)
        lookup_table[list] = list_data

    return lookup_table

def convert_char_to_unicode(char=None, list=None, linenumber=None):

    if isinstance(char, int):
        char = str(char)

    code_points = [ord(x) for x in char]
    unicodes=[]
    for code_point in code_points:
        unicodes.append(f"U+{code_point:04X}")
        logging.debug("Codepoint: %s", f"U+{code_point:04X}")
    unicodes_string = ', '.join(unicodes)
        
    logging.debug("Character: %s, List: %s, Line number: %s is unicode: %s", char, list, linenumber, unicodes_string)
    
    return unicodes_string

def main():
    # if args.character:
    #     args.character
    #     print(convert_char_to_unicode(args.character))
    if args.unicode:
        print(convert_unicode_to_char(args.unicode))
    lookup_table = generate_lookup_table('./input_lists')
    output_lookup_table("./output/lookuptable.json", lookup_table)
    code_points = [ord(char) for char in "₴̧"]
    print(code_points)

if __name__ == "__main__":
    args = parse_arguments()
    log_level = get_log_level(args.logging)

    logging.basicConfig(level=log_level, format="%(asctime)s - %(levelname)s - %(message)s")
    
    main()
