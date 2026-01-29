#!/bin/bash
cd /home/kavia/workspace/code-generation/multivendor-marketplace-platform-206774-206785/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

