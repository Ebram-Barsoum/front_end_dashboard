import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { create_shift } from '../../services/apiShifts';

import { formatTime, handleMutationError } from '../../lib/healpers';
import { days, PrimaryButtonStyle, secondaryButtonStyle } from '../../lib/constants';
import { Shift } from '../../lib/interfaces';

import Button from '../../ui/Button';
import Column from '../../ui/Column';
import FormInput from '../../ui/FormInput';
import Row from '../../ui/Row';
import FormError from '../../ui/FormError';
import InputGroup from '../../ui/InputGroup';

export default function CreateShiftForm(): JSX.Element {
    const { register, reset, handleSubmit, formState: { errors } } = useForm<Shift>();
    const { isPending, mutate } = useMutation({ mutationFn: (shift: Shift) => create_shift(shift) });
    const queryClient = useQueryClient();

    const onSubmit: SubmitHandler<Shift> = (formData: Shift) => {
        // prepare dat for mutation
        formData.startTime = formatTime(formData.startTime);
        formData.endTime = formatTime(formData.endTime);

        if (!formData.days || formData.days.length === 0) {
            toast.error('Please select at least one day');
            return;
        }

        // creating a shift
        mutate(formData, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['shifts'] });
                reset();
            },
            onError: (error) => {
                handleMutationError(error, "Failed to create shift");
            }
        });
    }

    const handleResetForm = () => {
        reset();
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6 p-4 bg-white rounded-xl w-[366px]  md:p-[38px] '>
            <Row as={'h1'} className='text-[22px] justify-center'> Add New Shift</Row>

            <Column className='gap-4'>
                <Row className='text-primary text-[14px]'>On these days</Row>

                <Row className='gap-[27px]'>
                    {
                        [...days].map((day) => {
                            return <Column key={day} className='gap-2 items-center'>
                                <input id={day} type='checkbox' className='h-[18px] w-[18px] cursor-pointer peer-target:bg-primary' value={day.slice(0, 3)}
                                    {...register('days')
                                    }
                                />
                                <label htmlFor={day} className='cursor-pointer'>{day.at(0)}</label>
                            </Column>
                        })
                    }
                </Row>

                <InputGroup className='grid-cols-2'>
                    <Column className='gap-2'>
                        <FormInput
                            type='time'
                            label="Shift Start Time"
                            labelClassName='text-[14px] ms-2'
                            {...register("startTime", {
                                required: "start time is required"
                            })}
                        />
                        {errors.startTime && <FormError message={errors.startTime.message} />}
                    </Column>

                    <Column className='gap-2'>
                        <FormInput
                            label="Shift End Time"
                            labelClassName='text-[14px] ms-2'
                            type='time'
                            {...register("endTime", {
                                required: "start time is required"
                            })}
                        />
                        {errors.endTime && <FormError message={errors.endTime.message} />}
                    </Column>
                </InputGroup>

                <Row className='gap-[18px]'>
                    <Button
                        type='submit'
                        className={PrimaryButtonStyle}
                        disabled={isPending}
                    >
                        Add
                    </Button>

                    <Button
                        type='button'
                        disabled={isPending}
                        onClick={handleResetForm}
                        className={secondaryButtonStyle}
                    >
                        Reset
                    </Button>
                </Row>
            </Column>
        </form>
    )
}
