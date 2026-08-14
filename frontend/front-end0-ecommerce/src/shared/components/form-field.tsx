import type { ComponentProps } from "react";
import type { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { useController } from "react-hook-form";

import { Input, type InputProps } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";

type FormInputProps<TValues extends FieldValues, TName extends FieldPath<TValues>> = UseControllerProps<TValues, TName> &
    Omit<InputProps, "value" | "onChange" | "onBlur" | "name" | "isInvalid">;

/**
 * Bridges react-hook-form and Untitled UI's react-aria inputs, which report
 * `onChange(value: string)` rather than a DOM event.
 */
export function FormInput<TValues extends FieldValues, TName extends FieldPath<TValues>>({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    hint,
    ...inputProps
}: FormInputProps<TValues, TName>) {
    const { field, fieldState } = useController({ name, control, rules, defaultValue, shouldUnregister });

    return (
        <Input
            {...inputProps}
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            isInvalid={fieldState.invalid}
            hint={fieldState.error?.message ?? hint}
        />
    );
}

type FormTextAreaProps<TValues extends FieldValues, TName extends FieldPath<TValues>> = UseControllerProps<TValues, TName> &
    Omit<ComponentProps<typeof TextArea>, "value" | "onChange" | "onBlur" | "name" | "isInvalid">;

/** Same bridge as `FormInput`, for Untitled UI's textarea. */
export function FormTextArea<TValues extends FieldValues, TName extends FieldPath<TValues>>({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    hint,
    ...textAreaProps
}: FormTextAreaProps<TValues, TName>) {
    const { field, fieldState } = useController({ name, control, rules, defaultValue, shouldUnregister });

    return (
        <TextArea
            {...textAreaProps}
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={fieldState.invalid}
            hint={fieldState.error?.message ?? hint}
        />
    );
}
