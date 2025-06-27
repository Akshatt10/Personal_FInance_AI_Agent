const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function callAgent(){
    const completion = await groq.chat.completions
    .create({
      messages: [
        {
          role: "user",
          content: "Hi",
        },
      ],
      model: "llama-3.3-70b-versatile",
    })
    .then((chatCompletion) => {
      console.log(chatCompletion.choices[0]?.message?.content || "");
    });
}