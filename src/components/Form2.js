import "../css/style.css";
export default function Form1({ handleInput2, showvalue, ...props }) {
    return <div className="card">
        <span >{showvalue}</span>
        <input name="input2" className="" onChange={(e) => handleInput2(e)} />


    </div>
}