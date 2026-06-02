import Select from "react-select"

function BackofficeSelect({ inputId, label, value, options = [], placeholder = "Select...", onChange, required = false, isDisabled = false }) {
  const selectedOption = options.find((option) => option.value === value) || null

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm text-muted">
          {label}
        </label>
      )}

      <Select
        inputId={inputId}
        value={selectedOption}
        onChange={(selectedOption) => {
          onChange(selectedOption?.value || "")
        }}
        options={options}
        placeholder={placeholder}
        isSearchable
        isClearable={!required}
        isDisabled={isDisabled}
        classNamePrefix="bo-select"
      />

      {required && (
        <input tabIndex="-1" autoComplete="off" value={value} onChange={() => {}} required className="pointer-events-none absolute h-0 w-0 opacity-0" />
      )}
    </div>
  )
}

export default BackofficeSelect
