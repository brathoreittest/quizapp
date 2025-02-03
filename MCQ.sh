# Image file in the current directory
IMG_PATH="./5.jpeg"  # Or use $1 for a script argument

# Use a temporary file to hold the base64 encoded image data
TEMP_B64=$(mktemp)
trap 'rm -f "$TEMP_B64"' EXIT
base64 $B64FLAGS $IMG_PATH > "$TEMP_B64"

# Use a temporary file to hold the JSON payload
TEMP_JSON=$(mktemp)
trap 'rm -f "$TEMP_JSON"' EXIT

cat > "$TEMP_JSON" << EOF
{
  "contents": [{
    "parts":[
      {"text": "With the help of attached image, provide 10 Multiple Choice Questions in json format where question should have property name 'question' only and  it should also have an asnwer in the object, instead of options it should be 'choices' only and instead of answer and what is the answer it should be index of that answer and proprty name should be 'correctAnswer' only.."},
      {
        "inline_data": {
          "mime_type":"image/jpeg",
          "data": "$(cat "$TEMP_B64")"
        }
      }
    ]
  }]
}
EOF


RESPONSE=$(curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDppd5Y238A_VQtsCL2ZoZLo2bjNRx81AM" \
    -H 'Content-Type: application/json' \
    -X POST \
    -d "@$TEMP_JSON")



echo "$RESPONSE" | jq '.candidates[0].content.parts[0].text | fromjson'
