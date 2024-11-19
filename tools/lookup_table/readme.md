# Lookup table generation

## Why

Many players in the game are using non-standard letters, or letters from other languages in their names.
To make filtering them in our tool possible we are using a combination of the package unidecode and out own lookup table.

The matching is done based on how a character looks, not what it means. for example: `✟` is a cross, but looks like a `T`

## Check if a name is not correclty translated

If a player has a name that is not natively searchable, opening that players details will show the display name + the result of our process.
The latter one being what can actually be searched for. This will look like: `WF АНАЛЬНЫЙ ГЕНИЙ (WF ANALbNYN GENIN)`

As seen in this example, the unidecode package does not help enough with the decoding. We now have to manually add the `Н` to the input list of `H`.

## Adding items to the lookup table

Adding items to the list is easy, in the input_lists folder there are a number of files. each file contains characters that should be decoded to the name of the file they are in.
The filter does not care about upper or lower case when searching.
aHowever, when it is obvious something looks more like a lowercase `a` than an uppercase `A`, please put in in the file for `a`.

The generation of the lookup table can be done by running `./generate_lookup_table.py`, if you have python3 installed.
This will make the `./output/lookuptable.json` file, and warn if any characters are duplicated in an input file.