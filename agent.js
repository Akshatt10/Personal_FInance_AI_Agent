import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function callAgent(){
    const completion = await groq.chat.completions
    .create({
      messages: [
        {
            role: "system",
            content: `You are a personal finance AI agent. You help users manage their finances, track expenses, and provide budgeting advice. You are friendly, knowledgeable, and always ready to assist with financial queries.
            current date ${new Date().toUTCString().split('T')[0]}.`,
        },
        {
          role: "user",
          content: "How much money did I spend this month?",
        },
      ],
      model: "llama-3.3-70b-versatile",
      tools:[
        {
            type: "function",
            function:{
                name: "getTotalExpenses",
                description: "Get the total expenses between two dates.",
                parameters: {
                    type: "object",
                    properties: {
                        from: {
                            type: "string",
                            description: "The start date in YYYY-MM-DD format."
                        },
                        to: {
                            type: "string",
                            description: "The end date in YYYY-MM-DD format."
                        }
                    },
                   
                }
            }
        }
      ]
    })

    console.log(JSON.stringify(completion.choices[0], null, 2));

    const toolCalls = completion.choices[0].message.tool_calls
    if (!toolCalls){
        console.log(`Assitant response: ${completion.choices[0].message.content}`);
        return
    }

    for (const tool of toolCalls) {
        const functionName = tool.function.name;
        const functionArgs = tool.function.arguments;

        let result = "";
        if(functionName === 'getTotalExpenses'){
            result = getTotalExpenses(JSON.parse(functionArgs));
        }
    }
}

callAgent()




// TOOL making


function getTotalExpenses(from, to) {
    console.log("Calling the getTotalExpenses tool with parameters:");
    
    return 199990;
}