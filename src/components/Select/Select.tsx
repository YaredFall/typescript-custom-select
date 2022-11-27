import React, {FC, useEffect, useState} from 'react';
import styles from "./select.module.css"

export type SelectOption = {
    label: string;
    value: string | number;
}

type SingleSelectProps = {
    multiple?: false
    currentOption?: SelectOption
    onChange: (option: SelectOption | undefined) => void
}

type MultipleSelectProps = {
    multiple: true
    currentOption: SelectOption[]
    onChange: (option: SelectOption[]) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

const Select: FC<SelectProps> = ({ multiple, currentOption, onChange, options}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const toggleOptions = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("toggle");
        setIsOpen(prev => !prev);
    }
    const hideOptions = () => setIsOpen(false);
    const clearOptions = (e: React.MouseEvent): void => {
        e.stopPropagation();
        multiple ? onChange([]) : onChange(undefined);
    }

    const selectOption = (option: SelectOption) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (multiple) {
            if (currentOption.includes(option)) {
                onChange(currentOption.filter(o => o !== option));
            } else {
                onChange([...currentOption, option])
            }
        } else {
            if (option !== currentOption) {
                onChange(option);
            }
        }
        hideOptions();
    }

    const isSelected = (option: SelectOption) =>
        multiple ? currentOption.includes(option)
        : option == currentOption;

    useEffect(() => {
        if (!isOpen)
            setHighlightedIndex(0);
    }, [isOpen])

    return (
        <div className={styles.container} onClick={toggleOptions} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
                hideOptions();
            }
        }} tabIndex={0}>
            <span className={styles["chosen-label"]} children={multiple ? currentOption.map(o => (
                <button key={`ch${o.value}`} className={styles["option-badge"]} onClick={selectOption(o)}>
                    {o.label}<span className={styles["clear-btn"]} children="&times;" />
                </button>
            )) : currentOption?.label} />
            <button className={styles["clear-btn"]} onClick={clearOptions} children="&times;" />
            <div className={styles.divider} />
            <button className={styles["close-btn"]} onClick={toggleOptions} children={<div className={styles.caret}/>} />
            <ul className={`${styles.options} ${isOpen ? styles.shown : ""}`} children={options.map(
                (option, index) => (<li
                    key={`li${option.value}`}
                    className={`${styles.option} ${isSelected(option) ? styles.selected : ""} ${index == highlightedIndex ? styles.highlighted : ""}`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={selectOption(option)}
                    children={option.label} />)
            )} />
        </div>
    );
}

export default Select;