import Groq from "groq-sdk";


const expenseDB = []


const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function callAgent(){

    const messages = [ {
            role: "system",
            content: `You are a personal finance AI agent. You help users manage their finances, track expenses, and provide budgeting advice. You are friendly, knowledgeable, and always ready to assist with financial queries.
            current date ${new Date().toUTCString().split('T')[0]}.`,
        }]

        messages.push( {
          role: "user",
          content: "Hey i just bought a new iPhone 15 Pro Max for 100000",
        })

    while(true){
        const completion = await groq.chat.completions
    .create({
      messages: messages,
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
        },
        {
            type: "function",
            function:{
                name: "addExpense",
                description: "Add a new expense to the database.",
                parameters: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Name of the expense.  eg: 'Bought an iphone 15 Pro Max' or 'Bought a new laptop'."
                        },
                        amount: {
                            type: "string",
                            description: "Amount of the expense in INR.  eg: '100000' or '50000'."
                        }
                    },
                   
                }
            }
        }
      ]
    })

    messages.push(completion.choices[0].message);

    const toolCalls = completion.choices[0].message.tool_calls

    if (!toolCalls){
        console.log(`Assitant response: ${completion.choices[0].message.content}`);
        break;
    }

    for (const tool of toolCalls) {
        const functionName = tool.function.name;
        const functionArgs = tool.function.arguments;

        let result = "";
        if(functionName === 'getTotalExpenses'){
            result = getTotalExpenses(JSON.parse(functionArgs));
        }
        else if(functionName === 'addExpense'){
            result = addExpense(JSON.parse(functionArgs));
        } else {
            console.error(`Unknown function: ${functionName}`);
            continue;
        }

    messages.push({
            role: "tool",
            content: result,
            tool_call_id: tool.id,
    })
    }
    }
}

console.log("Starting the personal finance AI agent...", expenseDB);

callAgent()

// TOOL making


function getTotalExpenses(from, to) {
    console.log("Calling the getTotalExpenses tool with parameters:");
    const expense = expenseDB.reduce((ac, item) => {
        return acc + expense.amount;
    }, 0);
    return `Total expenses from ${from} to ${to} is ${expense} INR`;
}


function addExpense({name, amount}) {

    console.log(`Adding expense: ${name} - ${amount} INR`);
    
    expenseDB.push({name, amount});
    console.log("Calling the addExpense tool with parameters:");
    
    return "Expense added successfully";
}