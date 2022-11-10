import React from 'react'

type FieldTextProps = {
  name: string
  onChange: (event: any) => void
  validationMessage?: { error?: string }
  value?: string
  onBlur?: any
}
// TODO replace with looker component
export const FieldText: React.FC<FieldTextProps> = ({
  name,
  onBlur,
  onChange,
  validationMessage,
  value
}) => {

  return (
    <>
      <div>
        <label htmlFor={name}>{name}</label>
        <div>
          <input
            id={name}
            type="string"
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
          />
        </div>
        {validationMessage?.error && <p>{validationMessage.error ?? ''}</p>}
      </div>
    </>
  )
}
