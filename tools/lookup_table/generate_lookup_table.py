#!/bin/env python3

import logging
import argparse
import json
import os

def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="A script with adjustable logging levels.")
    parser.add_argument("--logging", type=str, default="info",
                        help="Set the logging level (debug, info, warning, error, critical)")
    parser.add_argument("--character", type=str)
    parser.add_argument("--unicode", type=str)

    return parser.parse_args()

def get_log_level(level_name):
    """Convert a string log level name to a logging level."""
    levels = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL
    }

    return levels.get(level_name.lower(), logging.INFO)

def get_filelist(dir):
    files = [f for f in os.listdir(dir) if os.path.isfile(os.path.join(dir, f))]
    sorted_files = sorted(files, key=lambda x: x.lower())
    
    return sorted_files

def increment_hex(hex_value):
    int_value = int(hex_value, 16)
    
    int_value += 1
    
    # Convert back to hexadecimal and return, removing the "0x" prefix
    return hex(int_value)[2:].upper()

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
    with open(file_path, 'r') as file:

        return [line.strip() for line in file]

def generate_lookup_table(input_dir):
    input_lists = get_filelist(input_dir)
    logging.debug("Found input lists: %s", input_lists)
    lookup_table = {}
    
    for list in input_lists:
        logging.debug("Processing input list: %s", list)
        filepath = f"{input_dir}/{list}"
        special_characters = load_input(filepath)
        list_data = []
        for linenumber, character in enumerate(special_characters, start=1):
            # print(character, linenumber)
            character_data = convert_char_to_unicode(char=character, list=list, linenumber=linenumber)
            list_data.append(character_data)
            # print(character_data)
        # print(special_characters)
        lookup_table[list] = list_data
        # print(lookup_table)

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


    # pass

    # if len(char) == 1:
    #     unicode_value = ord(char)

    #     result = f"U+{unicode_value:04X}"
        
    #     return result
    # else:
    #     match (char is not None, list is not None, linenumber is not None):
    #         case (True, False, False):  # Only `char` is specified
    #             logging.warning("Please enter exactly one character: %s", char)
            
    #         case (True, True, True):  # All three variables are specified
    #             logging.warning("Character: %s, List: %s, Line number: %s is not cooperating", char, list, linenumber)
            
    #         case _:  # Fallback for other cases
    #             logging.warning("Invalid combination of inputs")

def main():
    """Main function that runs the core logic."""
    # if args.character:
    #     args.character
    #     print(convert_char_to_unicode(args.character))
    if args.unicode:
        print(convert_unicode_to_char(args.unicode))
    lookup_table = generate_lookup_table('./input_lists')
    output_lookup_table("./output/lookuptable.json", lookup_table)
    code_points = [ord(char) for char in "₴̧"]
    print(code_points)
    # ord('₴̧')


if __name__ == "__main__":
    # Parse arguments in a separate function
    args = parse_arguments()
    log_level = get_log_level(args.logging)

    # Configure logging level
    logging.basicConfig(level=log_level, format="%(asctime)s - %(levelname)s - %(message)s")
    
    # Run the main function
    main()
