
import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';

const ModelBox = ({ setAdopters, setAwareFarmers }) => {
    const runModel = async (gui) => {
        
    };

    return (
        <div>
            <h2>The Model</h2>
            <div>
                <Dropdown label="Frequency Direct Ad:" options={['Option1', 'Option2']} />
                <Dropdown label="Type Direct Ad:" options={['Option1', 'Option2']} />
                <Dropdown label="Frequency Chief Training:" options={['Option1', 'Option2']} />
                <TextInput label="Number of Ticks:" />
            </div>
            <div>
                <Button label="Start Model without NetLogo GUI" onClick={() => runModel(false)} variant="solid-orange"/>
                <Button label="Start Model with NetLogo GUI" onClick={() => runModel(true)} variant="solid-orange"/>
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


export default ModelBox;
