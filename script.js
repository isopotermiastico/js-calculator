button_names = ["%", "CE", "C", "Del", "1/x", "x^2", "sqr(x)", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="]
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
    parent.appendChild(button);
    });

}

calc_grid = document.getElementById("calcGrid");
createCalcButtonGrid(calc_grid, button_names);