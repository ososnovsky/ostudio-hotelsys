import { useState } from "react";
import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";

import { useCreateGuest } from "./useCreateGuest";
import { useEditGuest } from "./useEditGuest";
import { flags } from "../../data/data-flags"


function CreateGuestForm({ guestToEdit = {}, onCloseModal }) {
  const { createGuest, isCreating } = useCreateGuest();
  const { editGuest, isEditing } = useEditGuest();
  const [countryFlag, setCountryFlag] = useState("");

  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = guestToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, setValue, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const handleNationalityChange = (event) => {
    const nationalityValue = event.target.value;

    const abbreviation = Object.keys(flags[0]).find(key => flags[0][key] === nationalityValue);

    if (abbreviation) {
      setCountryFlag(`https://flagcdn.com/${abbreviation.toLowerCase()}.svg`);
    }
  }

  function onSubmit(data) {
    const formData = { ...data, countryFlag };

    if (isEditSession) editGuest({ newGuestData: formData, id: editId }, {
      onSuccess: (data) => {
        reset();
        onCloseModal?.()
      }
    },);

    else createGuest(formData, {
      onSuccess: (data) => {
        reset();
        onCloseModal?.()
      }
    },);
  }

  function onError(errors) {
    console.log(errors)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>

      <FormRow label='Guest name' error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isWorking}
          {...register('fullName', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label='Email address' error={errors?.email?.message}>
        <Input
          type="text"
          id="email"
          disabled={isWorking}
          {...register('email', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label='Nationality' error={errors?.nationality?.message}>
        <Input
          type="text"
          id="nationality"
          disabled={isWorking}
          {...register('nationality', { required: 'This field is required' })}
          onChange={handleNationalityChange}
        />
      </FormRow>

      <FormRow label='National ID' error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isWorking}
          {...register('nationalID', { required: 'This field is required' })}

        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking}>{isEditSession ? 'Edit guest' : 'Create new guest'}</Button>
      </FormRow>
    </Form >
  );
}

export default CreateGuestForm;

