from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS

# 🔑 Replace with your OpenRouter key
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

def translate_message(user_message, lang):
    """
    Translate user input into the chosen language before sending to main chat.
    """
    if lang == "en":  # No translation needed
        return user_message

    translation = client.chat.completions.create(
        model="deepseek/deepseek-r1:free",
        messages=[
            {"role": "system", "content": f"Translate the following text into {lang}. Only give translated text."},
            {"role": "user", "content": user_message}
        ]
    )
    return translation.choices[0].message.content.strip()


# @app.route("/")
# def home():
#     return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message")
    lang = data.get("lang", "en")  # default English

    # 🔄 Translate input to chosen language
    translated_input = translate_message(user_message, lang)

    # 🎨 Generate bot reply in same language
    completion = client.chat.completions.create(
        model="deepseek/deepseek-r1:free",
        messages=[
            {
                "role": "system",
                "content": (
                    f"You are a handicraft expert. Reply ONLY in {lang} language.\n"
                     "Your response must be formatted in HTML with the following sections:\n\n"
                    "<b>📜 History:</b> ...<br><br>"
                    "<b>👷 Labour Needed:</b> ...<br><br>"
                    "<b>⏳ Time to Make:</b> ...<br><br>"
                    "<b>🌟 Unique Facts:</b> ...<br><br>"
                    "<b>🤔 Follow-up:</b> End with a question to keep the conversation going.<br>\n"
                    "Avoid unnecessary explanations and always return cleanly formatted HTML."
                )

            },
            {"role": "user", "content": translated_input}
        ]
    )

    bot_reply = completion.choices[0].message.content
    return jsonify({"reply": bot_reply})
 


if __name__ == "__main__":
    app.run(debug=True)