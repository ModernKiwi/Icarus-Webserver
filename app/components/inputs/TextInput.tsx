import styles from './textInput.css';

export const cssLinks = () => [{ rel: 'stylesheet', href: styles }];

type textInputProps = {
  labelText: string;
  inputType: string;
  placeholdText: string;
  inputCSSType: 'topForm' | 'midForm' | 'botForm' | 'roundedForm' | 'boxForm';
  required?: boolean;
  autoComplete?: string;
};

export const TextInput: React.FC<textInputProps> = (Props) => {
  const required = Props.required || false;
  const autoComplete = Props.autoComplete || undefined;
  const cssStyle = ['inputStyle', Props.inputCSSType];
  return (
    <div className='inputBlock'>
      <label htmlFor={Props.labelText} className='sr-only'>
        {Props.labelText}
      </label>
      <input
        id={Props.labelText}
        autoFocus={true}
        name={Props.labelText}
        type={Props.inputType}
        placeholder={Props.placeholdText}
        className={cssStyle.join(' ')}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
};
