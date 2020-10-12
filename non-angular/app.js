const reasonInput = document.querySelector('#input-reason');
const amountInput = document.querySelector('#input-amount');
const clearBtn = document.querySelector('#btn-clear');
const addBtn = document.querySelector('#btn-add');
const expensesList = document.querySelector('#expenses-list')
const expensesTotalSpan = document.querySelector('#total-expenses')

let expensesTotal = 0;
expensesTotalSpan.textContent = expensesTotal;

function handleClear(){
    reasonInput.value = '';
    amountInput.value = '';
}

function presentInputsErrorAlert() {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = 'Invalid Inputs';
    alert.message = 'Please enter a valid reason and amount!';
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    return alert.present();
  }


function handleAdd(){
    const enteredReason= reasonInput.value;
    const enteredAmount= amountInput.value;
    if(enteredReason.trim().length <= 0 || enteredAmount <= 0 || enteredAmount.trim().length <= 0){
        presentInputsErrorAlert();
        return;
    }
    const newItem = document.createElement('ion-item');
    newItem.textContent = enteredReason + ': $' + enteredAmount;
    expensesList.appendChild(newItem);
    expensesTotal += parseInt(enteredAmount);
    expensesTotalSpan.textContent = expensesTotal;
    handleClear();
}

clearBtn.addEventListener('click', handleClear);
addBtn.addEventListener('click', handleAdd);