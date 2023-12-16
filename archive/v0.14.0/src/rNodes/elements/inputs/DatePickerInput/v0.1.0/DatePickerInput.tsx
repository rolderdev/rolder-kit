import { Indicator } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useShallowEffect } from '@mantine/hooks'
import { IconCalendar } from '@tabler/icons-react'
import Dayjs from 'dayjs'
import { useState } from 'react'

export default function DatePickerInput_v0_1_0(props: any) {
  const { formHook, formField, dateFormat, limitMinDate, daysOffset, selectedInputDates, selectedInputDate } = props
  const [value, setValue] = useState<any>();

  // form
  useShallowEffect(() => {
    const formValue = formHook?.values[formField]
    if (Array.isArray(formValue)) props.selectedDates(selectedInputDates)
    else props.selectedDate(selectedInputDate)
  }, [formHook?.values[formField]])

  // controlled  
  useShallowEffect(() => {
    setValue(selectedInputDate)
    props.selectedDate(selectedInputDate)
  }, [selectedInputDate])
  useShallowEffect(() => {
    setValue(selectedInputDates)
    props.selectedDates(selectedInputDates)
  }, [selectedInputDate])


  return (
    <DatePickerInput
      renderDay={(date) => {
        const day = date.getDate()
        return (
          <Indicator size={6} color="blue" offset={-5} disabled={Dayjs(date).dayOfYear() !== Dayjs().dayOfYear()}>
            <div>{day}</div>
          </Indicator>
        )
      }}
      icon={<IconCalendar size="1.25rem" stroke={1.5} />}
      valueFormat={dateFormat}
      minDate={limitMinDate && Dayjs().add(daysOffset, 'day').toDate()}
      value={value}
      onChange={(value: any) => {
        if (Array.isArray(value)) props.selectedDates(value)
        else props.selectedDate(value)
        setValue(value)
      }}
      {...props}
      {...formHook?.getInputProps(formField)}
    />
  )
}