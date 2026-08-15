#!/bin/bash
# Check buttons without text and aria-label
echo "Buttons without aria-label:"
grep -rn "<button" frontend/src/ | while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    line_num=$(echo "$line" | cut -d: -f2)
    # Get the button tag and following lines to see if there's aria-label or text
    content=$(sed -n "${line_num},$(($line_num + 10))p" "$file")

    if ! echo "$content" | grep -q "aria-label"; then
        # Check if it has text (simplistic check for an icon only button)
        if echo "$content" | grep -q "<[A-Z][a-zA-Z]*Icon" || echo "$content" | grep -q "<[A-Z][a-zA-Z]* className"; then
            if ! echo "$content" | sed -e 's/<[^>]*>//g' | grep -q "[a-zA-Z]"; then
               echo "$file:$line_num"
               echo "$content" | head -n 5
               echo "---"
            fi
        fi
    fi
done
