import React, {FC, useEffect, useRef, useState} from 'react';
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

    const containerRef = useRef<HTMLDivElement>(null);

    const toggleOptions = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    }
    const hideOptions = () => setIsOpen(false);
    const clearOptions = (e: React.MouseEvent): void => {
        e.stopPropagation();
        multiple ? onChange([]) : onChange(undefined);
    }

    const selectOption = (option: SelectOption) => (e: React.MouseEvent | KeyboardEvent) => {
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

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return;
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev);
                    if (isOpen) {
                        selectOption(options[highlightedIndex])(e);
                    }
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) {
                        setIsOpen(true);
                        break
                    }

                    const newIndex = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if (newIndex >= 0 && newIndex < options.length) {
                        setHighlightedIndex(newIndex);
                    }
                    break
                }
                case "Escape":
                    setIsOpen(false);
                    break
            }
        }
        containerRef.current?.addEventListener("keydown", handler)

        return () => {
            containerRef.current?.removeEventListener("keydown", handler);
        }
    }, [isOpen, highlightedIndex, options]);


    return (
        <div ref={containerRef} className={styles.container} onClick={toggleOptions} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
                hideOptions();
            }
        }} tabIndex={0}>
            <span className={styles["chosen-label"]} children={multiple ? currentOption.map(o => (
                <button key={`ch${o.value}`} className={styles["option-badge"]} onClick={selectOption(o)}>
                    {o.label}<span className={styles["clear-btn"]} children="&times;" />
                </button>
            )) : currentOption?.label} />
            <button className={styles["clear-btn"]} onClick={clearOptions} children="&times;" title={"Remove selected"} />
            <div className={styles.divider} />
            <div className={styles["close-icon"]} onClick={(e) => {
                toggleOptions(e);
                containerRef.current?.focus();
            }} children={<div className={`${styles.caret} ${isOpen ? "" : styles.highlighted}`}/>} />
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