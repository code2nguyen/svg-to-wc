#!/bin/bash

# Clone repos
echo "Remove tmp folder..."
rm -rf ../tmp

echo "Clone repos..."
git clone --depth=1 https://github.com/google/material-design-icons.git ../tmp/material-design-icons
git clone --depth=1 https://github.com/artcoholic/akar-icons-app.git ../tmp/akar-icons