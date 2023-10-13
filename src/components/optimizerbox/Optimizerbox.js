import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';

const OptimizerBox = ({ setAdopters, setAwareFarmers }) => {
    const runModel = async (gui) => {
    };

    return (
        <div className="optimizerBox">
            <h2>The Optimizer</h2>
            <div className="flexContainer">
                <Dropdown label="Which parameter to optimize:" options={['Option1', 'Option2']} />
                <TextInput label="More constraints:" />
            </div>
            <div className="flexContainer">
                <Button label="Start Optimizer" onClick={() => runModel(false)} variant="solid-orange" />
            </div>
        </div>
    );
};

const TextInput = ({ label }) => {
    return (
        <div>
            <label>{label}</label>
            <input type="text" />
        </div>
    );
};


export default OptimizerBox;