#!/bin/bash

sed -i 's|'appwrite');|'react-native-appwrite');|g' react-native/index.js
sed -i 's|'appwrite';|'react-native-appwrite';|g' react-native/index.d.ts