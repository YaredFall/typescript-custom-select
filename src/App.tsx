import Select, {SelectOption} from "./components/Select/Select";
import {useState} from "react";

const options=[
    {label: "First", value: 1},
    {label: "Second", value: 2},
    {label: "Third", value: 3},
    {label: "Fourth", value: 4},
    {label: "Fifth", value: 5},
    {label: "Sixth", value: 6},
]

function App() {

    const [currentSingleOption, setCurrentSingleOption] = useState<SelectOption | undefined>(options[0]);
    const [currentMultipleOption, setCurrentMultipleOption] = useState<SelectOption[]>([options[0]]);

    return (
    <div className="App">
        <main>
            <h1 children={"Custom <select> element"} />
            <h4 children={"using React and TypeScript"} />

            <div className={"two-column wrapper"}>
                <div className="centred wrapper">
                    <h3 children={"Single option"} />
                    <Select
                        currentOption={currentSingleOption}
                        options={options}
                        onChange={option => setCurrentSingleOption(option)}
                    />
                </div>
                <div className="centred wrapper">
                    <h3 children={"Multiple options"} />
                    <Select
                        multiple={true}
                        currentOption={currentMultipleOption}
                        options={options}
                        onChange={option => setCurrentMultipleOption(option)}
                    />
                </div>
            </div>
        </main>
        <footer className={"two-column wrapper"}>
            <p>By <a href={"https://github.com/YaredFall"} title={"GitHub profile"}>YaredFall</a></p>
            <p>Source code can be found <a href={"https://github.com/YaredFall/typescript-custom-select"} title={"Project repository on GitHub"}>here</a></p>
        </footer>
    </div>
  )
}

export default App
