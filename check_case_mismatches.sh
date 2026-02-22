#!/bin/bash
# Script to check for case mismatches between import statements and actual filenames in the project
# Usage: bash check_case_mismatches.sh

# Find all import statements and extract imported file paths
find . -type f -name "*.tsx" -o -name "*.ts" | xargs grep -hoE "from ['\"](.*)['\"]" | sed -E "s/from ['\"](.*)['\"]/\1/" | sort | uniq > imports.txt

# Check each import path for case mismatches
while read -r import; do
  # Only check relative or aliased imports
  if [[ $import == .* || $import == @* ]]; then
    # Remove alias prefix if present
    path=${import//@\//}
    # Remove leading './' or '../'
    path=${path#./}
    path=${path#../}
    # Check if file exists (case-sensitive)
    if ! [ -e "$path.tsx" ] && ! [ -e "$path.ts" ] && ! [ -e "$path/index.tsx" ] && ! [ -e "$path/index.ts" ]; then
      echo "Potential case mismatch or missing file: $import"
    fi
  fi
done < imports.txt

rm imports.txt
