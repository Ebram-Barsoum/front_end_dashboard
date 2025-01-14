/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { create_user_address, update_user_address } from '../../services/apiAddress';

import { handleMutationError } from '../../lib/healpers';
import { addressInputs, cities, PrimaryButtonStyle, secondaryButtonStyle } from '../../lib/constants';
import { Address } from '../../lib/interfaces';

import Button from '../../ui/Button';
import Column from '../../ui/Column';
import FormInput from '../../ui/FormInput';
import Row from '../../ui/Row';
import CustomeDropDown from '../../ui/CustomDropDownMenu';
import DropDownIcon from '../../icons/DropDownIcon';
import { menuStyle } from '../App-users/AddAppUserForm';
import FormError from '../../ui/FormError';

interface AddressFormProps {
    userId?: string;
    addressToBeUpdated?: Address;
    setShowFormAddress?: (state: boolean) => void;
    setAddressToBeUpdated?: (state: Address | undefined) => void;
}

interface FormInputs extends Partial<Address> { }

export default function AddressForm({ userId, addressToBeUpdated, setShowFormAddress, setAddressToBeUpdated }: AddressFormProps): JSX.Element {
    const { id, street, city, area, district, landmark } = addressToBeUpdated || {};

    const mutFunc = addressToBeUpdated ? update_user_address : create_user_address;
    const { isPending, mutate } = useMutation({ mutationFn: (newAddress: Address) => mutFunc((id || userId) as string, newAddress) })
    const { register, handleSubmit, control, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            street, city, area, district, landmark
        }
    });

    const queryClient = useQueryClient();

    const handleResetForm = () => {
        setShowFormAddress?.(false);
    }

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        mutate(formData as Address, {
            onSuccess: (data) => {
                toast.success(data.message || "Address updated successfully");
                queryClient.invalidateQueries({ queryKey: ['address', userId] });
                setShowFormAddress?.(false);

                if (addressToBeUpdated) setAddressToBeUpdated?.(undefined)
            }
            , onError: (error) => {
                const fallbackError = "Failed to add address";
                handleMutationError(error, fallbackError);
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='p-[34px] border border-stroke rounded-xl flex flex-col gap-4'>
            <Row as={'h1'} className='text-primary text-[18px] justify-center font-bold'>
                Enter Address Details
            </Row>

            <Column className='gap-4'>
                <Controller
                    name='city'
                    rules={{ required: "City is required" }}
                    control={control}

                    render={({ field }) => {
                        return <Column className='gap-2'>
                            <CustomeDropDown
                                options={[...cities]}
                                value={field.value as string}
                                onChange={field.onChange}
                                placeholder='City'
                                placeholderIcon={<DropDownIcon />}
                                className={menuStyle}
                                width="100%"
                            />

                            {errors.city && <FormError message={errors.city.message} />}
                        </Column>
                    }}
                />

                {
                    addressInputs.map(({ id, type, name, label, validation }) => {
                        return <FormInput
                            key={id}
                            id={id}
                            type={type}
                            placeholder={label}
                            className='text-[12px]'
                            {...register(name as keyof Address, validation)}
                            error={errors[name as keyof Address]}
                        />
                    })
                }
            </Column>

            <Row className='justify-between gap-[10px]'>
                {id ?
                    <Button
                        type='submit'
                        disabled={isPending}
                        className={PrimaryButtonStyle}
                    >Save changes</Button>
                    : <>
                        <Button
                            type='submit'
                            disabled={isPending}
                            className={PrimaryButtonStyle}>
                            Add
                        </Button>
                        <Button
                            type='button'
                            disabled={isPending}
                            onClick={handleResetForm}
                            className={secondaryButtonStyle}>
                            Cancel
                        </Button>
                    </>}
            </Row>
        </form>
    )
}
