import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from 'react';
import { Field, useField, UseFieldConfig } from 'react-final-form';

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements['input']> {
  /** Field name. */
  name: string;
  /** Field label. */
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: 'text' | 'password' | 'email' | 'number';
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
  fieldProps?: UseFieldConfig<string>;
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === 'number'
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            (v) => (v === '' ? null : v),
      ...fieldProps,
    });

    const normalizedError = Array.isArray(error) ? error.join(', ') : error || submitError;

    return (
      <div {...outerProps}>
        <label {...labelProps} className="flex flex-col">
          {label}

          <Field
            {...input}
            disabled={submitting}
            className="p-1 dark:bg-gray-800 dark:text-white rounded-md border border-horz-green mt-0.5 outline-none focus:ring-horz-blue focus:ring"
            {...props}
            component={'input'}
            ref={ref}
          />
        </label>

        {touched && normalizedError && (
          <div role="alert" style={{ color: 'red' }}>
            {normalizedError}
          </div>
        )}
      </div>
    );
  },
);

export default LabeledTextField;
