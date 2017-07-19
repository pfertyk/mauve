#!/bin/bash

orig_file=$1
filename="${orig_file%.*}"

resolutions=(16 20 24 32 40 48 64 128 256)

for res in "${resolutions[@]}"
do
    convert -resize ${res}x${res} $orig_file ${filename}${res}.png
    convert ${filename}${res}.png -background none -gravity center -extent ${res}x${res} ${filename}${res}.png
done
