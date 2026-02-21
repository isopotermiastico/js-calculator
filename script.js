button_names = ["%", "CE", "C", "Del", "1/x", "x^2", "sqr(x)", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="]




const calc_state = 
{
    internal_operation: "0",
    big_number: "0",
    small_number: "", 
    calc_step: 0,
    result: null, 
    overwrite: false,
    previous_operation: ""
}


const operators = ["+", "-", "*", "/", "%"];


function isOperator(value)
{

    return operators.includes(value);
}







function updateCalcDisplay(command, button_name, entry)
{
    

    if (calc_state.internal_operation === "")
        {
            calc_state.big_number = "0";
        }
    
    switch (command)
    {
        case "write":
            if (entry === "internal_operation")
            {
                calc_state[entry] += button_name;
                return;
            }

            if (calc_state[entry] === "0" && entry === "big_number")
            {
                calc_state[entry] = button_name;
                calc_state.internal_operation = button_name;
            }
            else
            {
                calc_state[entry] += button_name;
                calc_state.internal_operation += button_name;
            }

            console.log(calc_state.calc_step);
            if (calc_state.calc_step >= 1)
                {
                    calc_state.previous_operation += button_name;
                }

        break

        case "replace":
            
            calc_state[entry] = button_name;
            console.log(calc_state.big_number);
            calc_state.internal_operation += button_name;

            console.log(calc_state.calc_step);
            if (calc_state.calc_step >= 1)
                {
                    calc_state.previous_operation += button_name;
                }

            break

        case "delete":
            calc_state.big_number = calc_state.big_number.slice(0, -1);
            calc_state.internal_operation = calc_state.internal_operation.slice(0, -1);
        break

        case "delete current entry":
/*             calc_state[entry] = ""; */   //wip
            break              

        default:
            break
    }

    previous_operation_dom = document.getElementById("previous_operation");
    internal_operation_dom = document.getElementById("internal_operation");
    small_number_dom = document.getElementById("smallNumber");
    big_number_dom = document.getElementById("bigNumber");

    previous_operation_dom.textContent = calc_state.previous_operation; //use for debugging
    internal_operation_dom.textContent = calc_state.internal_operation; //also debugging

    small_number_dom.textContent = calc_state.small_number;
    big_number_dom.textContent = calc_state.big_number;

}


function tryTriggerCalculation() //n op n mental frame
{
    if (calc_state.calc_step === 2)
    {
        calc_state.calc_step = 1;
        return true;
    }
    else
    {
        calc_state.calc_step++;
        return false;
    }
    
}


function triggerButton(button_name)
{
  switch (button_name)
    {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if (calc_state.overwrite)
                {
                    calc_state.big_number = button_name;
                    calc_state.internal_operation = button_name;
                    calc_state.overwrite = false;
                    calc_state.previous_operation = "";
                    updateCalcDisplay();
                    return
                }

            if (isOperator(calc_state.internal_operation.slice(-1))) 
            {
                tryTriggerCalculation();
                updateCalcDisplay("replace", button_name, "big_number");
                 //you're replacing big number, but you still need to write it internally
            }
            else
            {                
                updateCalcDisplay("write", button_name, "big_number"); 
                
            }
            
            break
        
        case ".":
            break

        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
            if (calc_state.overwrite)
                {
                    calc_state.overwrite = false;             
                    calc_state.previous_operation = "";
                    updateCalcDisplay();
                }

            if (!(isOperator(calc_state.internal_operation.slice(-1)))) 
                
                if (tryTriggerCalculation())
                {
                    calc_state.result = String(eval(calc_state.internal_operation));
                    calc_state.big_number = calc_state.result;
                    calc_state.small_number = calc_state.result + button_name;
                    calc_state.internal_operation = calc_state.small_number + calc_state.big_number;
                }
                else
                {
                    calc_state.small_number += calc_state.big_number;
                    updateCalcDisplay("write", button_name, "small_number");
                    
                    
                }

            break
            
        
        case "=":
            if (calc_state.overwrite)
                {
                    calc_state.result = eval(calc_state.internal_operation + calc_state.previous_operation);
                    calc_state.calc_step = 0;
                    calc_state.small_number = "";
                    calc_state.internal_operation = String(calc_state.result);
                    calc_state.big_number = String(calc_state.result);
                }
            calc_state.result = eval(calc_state.internal_operation);
            calc_state.small_number = "";
            calc_state.calc_step = 0;
            calc_state.big_number = String(calc_state.result);
            calc_state.internal_operation = String(calc_state.result);
            calc_state.overwrite = true;
            break
        
        case "CE":
            updateCalcDisplay("delete current entry");
            break
        case "C":
            updateCalcDisplay("delete everything");
            break
        case "Del":
            updateCalcDisplay("delete");
            break

        case "+/-":
        case "1/x":
        case "x^2":
        case "sqr(x)":
            break

        default:
            // code;
    }
    updateCalcDisplay()

}



function createCalcButtonGrid(parent, button_names)
{
    button_names.forEach(name => 
    {
        button = document.createElement("button");
        button.className = "calc-button"
        button.textContent = name;
        if (name === "=")
        {
            button.id = "equalsButton"
        }
    button.addEventListener("click", () => triggerButton(name))
    parent.appendChild(button);
    });

}


calc_grid = document.getElementById("calcGrid");
createCalcButtonGrid(calc_grid, button_names);








