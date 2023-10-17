import DigitBtn from './DigitBtn';
import OperationBtn from './OperationBtn';
import './App.css';
import { useReducer } from 'react';

export const ACTIONS={
  ADD_DIGIT:'add',
  CHOOSE_OPERATION:'choose',
  CLEAR_DIGIT:'clear',
  DELETE_DIGIT:'delete',
  EVALUATE:'evaluer'
}
function reducer(state,{type,payload}){
switch(type){
  case ACTIONS.ADD_DIGIT:
    if(state.overwrite){
      return{
        ...state,
        CurrentOperand:payload.digit,
        overwrite:false
      }
    }
    if (payload.digit === '0' && state.CurrentOperand ==="0"){return state} 
    if (payload.digit === '.' && state.CurrentOperand.includes(".")){return state} 
    return{
      ...state,
      CurrentOperand:`${state.CurrentOperand || ""}${payload.digit}`,
    }
  case ACTIONS.CLEAR_DIGIT:
    return{}
  case ACTIONS.CHOOSE_OPERATION:
    if (state.CurrentOperand ==  null && state.PreviousOperand == null){
    return state
    }
    if (state.CurrentOperand ==  null) {
      return{
        ...state,
        operation:payload.operation
      }
    }
    if(state.PreviousOperand == null){
      return{
      ...state,
      operation:payload.operation,
      PreviousOperand:state.CurrentOperand,
      CurrentOperand:null
    }
    }
    return{
        ...state,
        PreviousOperand:evaluate(state),
        CurrentOperand:null
      }

  case ACTIONS.DELETE_DIGIT:
    if(state.overwrite){
      return{
        ...state,
        overwrite:false,
        CurrentOperand:null
      }
    }
    if(state.CurrentOperand ==  null) return state
    if (state.CurrentOperand.length === 1){
      return{
        ...state,
        CurrentOperand: null
      }
    }
    return{
      ...state,
        CurrentOperand: state.CurrentOperand.slice(0,-1)
    }
  
  
    case ACTIONS.EVALUATE:
  if(state.CurrentOperand ==  null || state.PreviousOperand == null || 
    state.operation == null){
    return state 
  }
  return {
    ...state,
    operation: evaluate(state),
    PreviousOperand:null,
    CurrentOperand:null, 
    overwrite: true
  }
}



}
function evaluate({CurrentOperand,PreviousOperand,operation}){
  const prev =parseFloat(PreviousOperand)
  const current =parseFloat(CurrentOperand)
  if( isNaN(prev)|| isNaN(current)) return""
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current
      break
    case "-":  
      computation = prev - current
      break
    case "*":  
      computation = prev * current
      break
    case "/":  
      computation = prev / current
      break
  }
  return computation.toString()
}
const INTEGER_FORMATTEUR = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0
})
function formatOperand(operand){
  if (operand == null)return 
  const [integer,decimal]=operand.split(".")
  if(decimal == null) return INTEGER_FORMATTEUR.format(integer)
  return `${INTEGER_FORMATTEUR.format(integer)}.${decimal}`
}



function App() {
  const [{CurrentOperand,PreviousOperand,operation},dispatch]=useReducer(reducer,{})
 
  
  
  
  
  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>
          {formatOperand(PreviousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(CurrentOperand)}</div>
      </div>
      <button className='span-two' onClick={()=> dispatch({type:ACTIONS.CLEAR_DIGIT})}>
        AC</button>
      <button onClick={()=> dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationBtn operation="/" dispatch={dispatch}/>
      <DigitBtn digit="1" dispatch={dispatch}/>
      <DigitBtn digit="2" dispatch={dispatch}/>
      <DigitBtn digit="3" dispatch={dispatch}/>
      <OperationBtn operation="*" dispatch={dispatch}/>
      <DigitBtn digit="4" dispatch={dispatch}/>
      <DigitBtn digit="5" dispatch={dispatch}/>
      <DigitBtn digit="6" dispatch={dispatch}/>
      <OperationBtn operation="+" dispatch={dispatch}/>
      <DigitBtn digit="7" dispatch={dispatch}/>
      <DigitBtn digit="8" dispatch={dispatch}/>
      <DigitBtn digit="9" dispatch={dispatch}/>
      <OperationBtn operation="-" dispatch={dispatch}/>
      <DigitBtn digit="." dispatch={dispatch}/>
      <DigitBtn digit="0" dispatch={dispatch}/>
      <button className='span-two' onClick={()=> dispatch({type:ACTIONS.EVALUATE})}>
        =</button>
    </div>
  );
}

export default App;
