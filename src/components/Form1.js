import "../css/style.css";
export default function Form1({ handleInput1, showvalue, ...props }) {
    console.log("form1 showvalue is :" + showvalue);
    return <div className="card" id="input1">
        <span >{ }</span>
        <input name="input1" className="" onChange={(e) => handleInput1(e)} />


    </div>
}