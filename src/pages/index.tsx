import { Card, CardContent, Typography, Button } from '@material-ui/core'
import {Form, Formik, Field, FormikConfig, FormikValues} from 'formik'
import { CheckboxWithLabel, TextField } from 'formik-material-ui'
import { object, mixed, number, string } from 'yup'
import React, { useState } from 'react'


export default function Home(){
  return(
    <Card>
      <CardContent>
        <FormikStepper
        
        initialValues={{
          firstname: '',
          lastname: '',
          millionaire: false,
          money: 0,
          description: '',
        }} onSubmit={() => {}}>
            <FormikStep
            validationSchema={
              object({
                firstname: string().required(),
                lastname: string().required()
              })
            }
            label="Personal Data"
            >
              <Field name="firstname" component={TextField} label="First Name"/>
              <Field name="lastname" component={TextField} label="Last Name"/>
              <Field name="millionaire" type="checkbox" component={CheckboxWithLabel} Label={{label:"I am a millionaire"}}/>
            </FormikStep>
            <FormikStep 
            label="Bank Accounts"
            validationSchema={
          object({
            money: mixed().when('millionaire', {
              is: true,
              then: number().required().min(1_000_000, "You muste need to have 1 Million in your account"),
              otherwise: number().required()
            })
          })
        }>
              <Field name="money" type="number" component={TextField} label="All the money I have"/>
            </FormikStep>
            <FormikStep label="More Info">
              <Field name="description" component={TextField} label="Description"/>
            </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  )
}

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string;
}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({children, ...props}: FormikConfig<FormikValues>){
  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step] 
  console.log(currentChild)

  function isLastStep(){
    return step === childrenArray.length - 1;
  }

  return <Formik 
    {...props}
    validationSchema={currentChild.props.validationSchema}
    onSubmit={async (values, helpers) => {
      if(isLastStep()){
        await props.onSubmit(values, helpers);
      }else{
        setStep(s => s+1);
      }
    }}
  >
    <Form autoComplete="off">
      {currentChild}
      {step > 0 ? <Button onClick={() => setStep(s => s - 1)}>Back</Button>: null }
      <Button type="submit">{isLastStep() ? "Submit" : "Next"}</Button>
    </Form>
  </Formik>
}