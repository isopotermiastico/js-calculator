button_names = ["%", "CE", "C", "Del", "1/x", "x^2", "sqrt(x)", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="]




const calc_state = 
{
    big_number: "0",
    small_number: "", 
    calc_step: 0,
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
    calc_state.internal_operation = calc_state.first_operand + calc_state.operator + calc_state.second_operand;

    previous_operation_dom = document.getElementById("previousOperation");
    internal_operation_dom = document.getElementById("internalOperation");
    small_number_dom = document.getElementById("smallNumber");
    big_number_dom = document.getElementById("bigNumber");
    calc_step_dom = document.getElementById("calcStep");

    calc_step_dom.textContent = calc_state.overwrite; //use for debugging
    previous_operation_dom.textContent = calc_state.first_operand + calc_state.operator + calc_state.second_operand; //also debugging
    internal_operation_dom.textContent = calc_state.calc_step; //also debugging

    small_number_dom.textContent = calc_state.small_number;
    big_number_dom.textContent = calc_state.big_number;

}

function buttonToEvalReady(button_name, operand) //use for unary operators
{
    switch(button_name)
    {
        case "1/x": 
            return `(1/${operand})`;
        case "x^2":
            return `(${operand}**2)`;
        case "sqrt(x)":
            return `(Math.sqrt(${operand}))`;
        default:
            break
    }
}

function buttonToDisplayReady(button_name, operand) //use for unary operators
{
    switch(button_name)
    {
        case "1/x": 
            return `(1/${operand})`;
        case "x^2":
            return `(${operand}^2)`;
        case "sqrt(x)":
            return `(sqrt(${operand}))`;
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
                        calc_state.small_number = "";
                        updateCalcDisplay();
                        return;
                    }

                switch (calc_state.calc_step)
                {
                    case 0:
                        if (calc_state.big_number === "0")
                        {
                            calc_state.first_operand = button_name;
                            calc_state.big_number = button_name;
                        }
                        else
                        {
                            
                            calc_state.first_operand += button_name;
                            calc_state.big_number += button_name;
                        }  

                        break
                    case 1:
                        if (calc_state.operator === "")
                            {
                                calc_state.big_number = button_name;
                                calc_state.first_operand = button_name;
                                calc_state.calc_step = 0;
                                
                                updateCalcDisplay();
                                
                                return;
                            }
                        
                        calc_state.second_operand = button_name;
                        calc_state.calc_step++;
                        calc_state.big_number = button_name;

                        break
                    case 2:
                        calc_state.second_operand += button_name;
                        calc_state.small_number += button_name;
                        calc_state.big_number += button_name;
                        break
                }
                
                break
            
            case ".":
                break

            case "+":
            case "-":
            case "*":
            case "/":
                if (calc_state.overwrite)
                    {
                        calc_state.overwrite = false;             
                        calc_state.second_operand = "";

                        calc_state.first_operand = calc_state.big_number;
                        calc_state.small_number = calc_state.first_operand + button_name;
                        calc_state.operator = button_name;
                        calc_state.calc_step++;
                        updateCalcDisplay();
                        return;
                    }

                switch (calc_state.calc_step)
                {
                    case 0:
                        if (calc_state.first_operand === "")
                        {
                            calc_state.first_operand = "0";
                        }

                        calc_state.operator = button_name;
                        calc_state.small_number = calc_state.first_operand + button_name;
                        calc_state.calc_step++;
                        break
                    case 1:    
                        if (calc_state.operator === "")
                            {
                                calc_state.operator = button_name;
                                calc_state.small_number += calc_state.operator;
                            }
                        break
                    case 2:

                        result = String(eval(calc_state.internal_operation));
                        calc_state.big_number = result;
                        calc_state.first_operand = result;
                        calc_state.second_operand = result;
                        calc_state.small_number = calc_state.first_operand + button_name;
                        calc_state.calc_step = 1;
                        break
                }

                break
                
            
            
            
            case "CE": //delete current entry
                calc_state.big_number = "0";  
                switch (calc_state.calc_step)
                {
                    case 0:
                        calc_state.first_operand = "";
                        break
                    case 1:
                        break
                    case 2:
                        calc_state.second_operand = "";
                        calc_state.small_number = calc_state.first_operand + calc_state.operator + calc_state.second_operand;
                        calc_state.calc_step--;
                        break
                }
                break
            case "C": //delete everything
                calc_state.big_number = "0";
                calc_state.small_number = "";
                calc_state.first_operand = "";
                calc_state.operator = "";
                calc_state.second_operand = "";
                calc_state.calc_step = 0;
                calc_state.overwrite = false;
                break
            case "Del":
                if(!(isOperator()))
                    {
                        updateCalcDisplay("delete");
                    }
                break


                
            case "1/x":
            case "x^2":
            case "sqrt(x)":
                switch (calc_state.calc_step)
                    {
                        case 0:
                            result = String(eval(buttonToEvalReady(button_name, calc_state.first_operand)));  
                            calc_state.first_operand = result;
                            calc_state.small_number = buttonToDisplayReady(button_name, calc_state.big_number);
                            calc_state.big_number = result;
                            calc_state.calc_step++;
                            break
                        case 1:
        
                            break
                        case 2:
                            result = String(eval(buttonToEvalReady(button_name, calc_state.second_operand)));  
                            calc_state.small_number += buttonToDisplayReady(button_name, calc_state.big_number);
                            calc_state.big_number = result;
                            calc_state.second_operand = result;
                            break
                    }
                    break
            
            case "%":
                break
            case "+/-":
                break
            default:
                break

            case "=":
                previous_operation = calc_state.operator + calc_state.second_operand;
                if (calc_state.overwrite)
                    {
                        switch (calc_state.calc_step)
                            {
                                case 0:
                                    result = String(eval(calc_state.big_number + previous_operation));
                                    calc_state.calc_step = 0;
                                    calc_state.small_number = calc_state.internal_operation+"=";
                                    calc_state.big_number = result;
                                    calc_state.first_operand = result;

                                    break
                                case 1:
                                    result = String(eval(calc_state.first_operand + calc_state.operator + calc_state.big_number));
                                    calc_state.calc_step = 0;
                                    calc_state.small_number = calc_state.first_operand + calc_state.operator + calc_state.big_number+"=";
                                    calc_state.big_number = result;
                                    calc_state.first_operand = result;

                                    break
                                case 2:
                                    result = String(eval(calc_state.internal_operation));
                                    calc_state.calc_step = 0;
                                    calc_state.small_number = calc_state.internal_operation+"=";
                                    calc_state.big_number = result;
                                    calc_state.first_operand = result;
                                    break
                            }
                        
                        updateCalcDisplay()
                        return;
                    }

                switch (calc_state.calc_step)
                {
                    case 0:
                        calc_state.small_number = calc_state.internal_operation + "=";
                        calc_state.overwrite = true;
                        break
                    case 1:
                        if (calc_state.second_operand === "")
                            {
                                if (!(isOperator(calc_state.small_number.slice(-1))))
                                {       
                                    return;
                                }
                                
                                calc_state.second_operand = calc_state.big_number; //autofill
                                calc_state.calc_step = 2;
                                triggerButton("=");
                                return;

                                
                            }
                            else
                            {
                                result = String(eval(calc_state.internal_operation));
                                calc_state.big_number = result;
                                calc_state.small_number = calc_state.internal_operation + "=";
                                calc_state.calc_step = 0;
                                calc_state.overwrite = true;

                            }
                        
                        break
                    case 2:
                        result = String(eval(calc_state.internal_operation));
                        calc_state.calc_step = 0;
                        
                        if (isOperator(calc_state.small_number.slice(-1)))
                            {
                                calc_state.small_number = calc_state.small_number + calc_state.big_number + "=";
                            }
                            else
                            {
                                calc_state.small_number += "=";
                            }

                        calc_state.big_number = result;
                        calc_state.first_operand = result;
                        calc_state.operator = "";
                        calc_state.second_operand = "";
                        calc_state.overwrite = true;

                        

                        break
                }
                break
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








