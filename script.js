button_names = ["%", "CE", "C", "Del", "1/x", "x^2", "sqr(x)", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="]




const calc_state = 
{
    big_number: "0",
    small_number: "", 
    calc_step: 0,
    result: null, 
    overwrite: false,
    first_operand: "",
    operator: "",
    second_operand: "",
    internal_operation: ""

}


const operators = ["+", "-", "*", "/", "%"];


function isOperator(value)
{

    return operators.includes(value);
}







function updateCalcDisplay(command, button_name, entry)
{


    
    switch (command)
    {
        case "write":

            if (calc_state[entry] === "0" && entry === "big_number")
            {
                calc_state[entry] = button_name;
            }
            else
            {
                calc_state[entry] += button_name;
            }



            switch (calc_state.calc_step)
            {
                case 0:
                    calc_state.first_operand += button_name;
                    break
                case 1:
                    calc_state.operator = button_name;
  
                    break
                case 2:
                    calc_state.second_operand = button_name;
                    break
            }


        break

        case "replace":
            
            calc_state[entry] = button_name;

            switch (calc_state.calc_step)
                {
                    case 0:
                        calc_state.first_operand += button_name;
                        break
                    case 1:
                        calc_state.operator = button_name;
                        break
                    case 2:
                        calc_state.second_operand = button_name;
                        break
                }
            break

        case "delete":
            
            calc_state.big_number = calc_state.big_number.slice(0, -1);
            
            
            switch (calc_state.calc_step)
            {
                case 0:
                    calc_state.first_operand = "";
                    break
                case 1:
                    calc_state.operator = "";
                    break
                case 2:
                    calc_state.second_operand = "";
                    break
            }

            if (calc_state.big_number === "")
            {
                calc_state.big_number = "0";
                if (calc_state.calc_step > 0)
                    {
                        calc_state.calc_step--;
                    }
            }
    
            break

        case "delete current entry":
            calc_state.big_number = "0";  
            switch (calc_state.calc_step)
            {
                case 0:
                    calc_state.first_operand = "";
                    break
                case 1:
                    calc_state.operator = "";
                    calc_state.calc_step--;
                    break
                case 2:
                    calc_state.second_operand = "";
                    calc_state.calc_step--;
                    break
            }


            break              
        case "delete everything": 
                calc_state.big_number = "0";
                calc_state.small_number = "";
                calc_state.first_operand = "";
                calc_state.operator = "";
                calc_state.second_operand = "";
                calc_state.calc_step = 0;
                calc_state.overwrite = false;
            break

        default:
            break
    }


    calc_state.internal_operation = calc_state.first_operand + calc_state.operator + calc_state.second_operand;

    previous_operation_dom = document.getElementById("previousOperation");
    internal_operation_dom = document.getElementById("internalOperation");
    small_number_dom = document.getElementById("smallNumber");
    big_number_dom = document.getElementById("bigNumber");
    calc_step_dom = document.getElementById("calcStep");

    calc_step_dom.textContent = calc_state.calc_step; //also debugging
    previous_operation_dom.textContent = calc_state.first_operand + calc_state.operator + calc_state.second_operand; //use for debugging
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
    calc_state.internal_operation = calc_state.first_operand + calc_state.operator + calc_state.second_operand;

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
                        calc_state.overwrite = false;
                        calc_state.first_operand = "";
                        calc_state.operator = "";
                        calc_state.second_operand = "";
                        calc_state.small_number = calc_state.big_number;
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
                        calc_state.operator = "";
                        calc_state.second_operand = "";

                        calc_state.small_number = calc_state.big_number;
                        calc_state.first_operand = calc_state.big_number;
                        updateCalcDisplay("write", button_name, "small_number");
                        return
                    }

                if (!(isOperator(calc_state.internal_operation.slice(-1)))) 
                    
                    if (tryTriggerCalculation())
                    {
                        calc_state.result = String(eval(calc_state.big_number + calc_state.operator + calc_state.second_operand));
                        calc_state.big_number = calc_state.result;
                        calc_state.first_operand = calc_state.result;
                        calc_state.small_number = calc_state.result + button_name;
                    }
                    else
                    {
                        calc_state.small_number += calc_state.big_number;
                        calc_state.first_operand = calc_state.big_number;
                        updateCalcDisplay("write", button_name, "small_number");
                    }

                break
                
            
            case "=":
                previous_operation = calc_state.operator + calc_state.second_operand;

                if (calc_state.overwrite)
                    {
                        calc_state.result = String(eval(calc_state.big_number + previous_operation));
                        calc_state.calc_step = 0;
                        calc_state.small_number = calc_state.internal_operation+"=";
                        calc_state.big_number = calc_state.result;
                        calc_state.first_operand = calc_state.result;
                        updateCalcDisplay()
                        return
                        
                    }
                if (calc_state.calc_step === 1)
                    {
                        calc_state.result = String(eval(calc_state.internal_operation + calc_state.big_number));
                        calc_state.second_operand = calc_state.big_number;
                        calc_state.small_number = calc_state.internal_operation+"=";
                    }
                else
                    {
                        if (calc_state.internal_operation === "")
                            {
                                calc_state.internal_operation = calc_state.big_number;
                            }
                        calc_state.result = String(eval(calc_state.internal_operation));                 
                        calc_state.small_number = calc_state.internal_operation+"=";
                    }

                calc_state.calc_step = 0;
                calc_state.big_number = calc_state.result;
                calc_state.first_operand = calc_state.result;
                calc_state.overwrite = true;
                break
            
            case "CE":
                updateCalcDisplay("delete current entry");
                break
            case "C":
                updateCalcDisplay("delete everything");
                break
            case "Del":
                if(!(isOperator()))
                    {
                        updateCalcDisplay("delete");
                    }
                break

            case "+/-":
                break
                
            case "1/x":
            case "x^2":
            case "sqr(x)":
                switch (calc_state.calc_step)
                {
                    case 0:
                        
                        break
                    case 1:
    
                        break
                    case 2:
                        
                        break
                }
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








