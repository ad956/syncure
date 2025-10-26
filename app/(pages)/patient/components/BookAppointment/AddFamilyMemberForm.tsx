import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import { familyMemberSchema } from "@lib/validations/patient";
import { useFamilyMembers } from "@lib/hooks/patient";
import toast from "react-hot-toast";

interface AddFamilyMemberFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFamilyMemberForm({ onClose, onSuccess }: AddFamilyMemberFormProps) {
  const { familyMembers, mutate } = useFamilyMembers();

  const handleSubmit = async (values: any) => {
    const newMember = {
      _id: Date.now().toString(),
      name: values.name,
      relation: values.relation,
      age: parseInt(values.age),
      gender: values.gender,
      contact: values.contact
    };

    // Optimistic update
    mutate([...familyMembers, newMember], false);
    
    try {
      const response = await fetch('/api/patient/family-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...values, age: parseInt(values.age) }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Family member added successfully');
        mutate(); // Revalidate with server data
        onSuccess();
        onClose();
      } else {
        mutate(); // Revert on error
        toast.error(data.error || 'Failed to add family member');
      }
    } catch (error) {
      mutate(); // Revert on error
      toast.error('Failed to add family member');
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        relation: '',
        age: '',
        gender: '',
        contact: '',
      }}
      validate={(values) => {
        const validation = familyMemberSchema.safeParse({
          firstname: values.name.split(' ')[0] || '',
          lastname: values.name.split(' ').slice(1).join(' ') || '',
          contact: values.contact,
          country_code: '+91',
          gender: values.gender === 'male' ? 'Male' : values.gender === 'female' ? 'Female' : 'Other',
          dob: new Date().getFullYear() - parseInt(values.age || '0') + '-01-01',
          relation: values.relation
        });
        
        if (!validation.success) {
          const errors: any = {};
          validation.error.errors.forEach((err) => {
            const path = err.path[0];
            if (path === 'firstname' || path === 'lastname') {
              errors.name = 'Full name is required';
            } else if (path === 'dob') {
              errors.age = 'Valid age is required';
            } else {
              errors[path] = err.message;
            }
          });
          return errors;
        }
        return {};
      }}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h4>
            <Field name="name">
              {() => (
                <Input
                  label="Full Name"
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  isInvalid={touched.name && !!errors.name}
                  errorMessage={touched.name && errors.name}
                  variant="bordered"
                  placeholder="Enter full name"
                />
              )}
            </Field>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Relationship & Details</h4>
            <div className="space-y-4">
              <Field name="relation">
                {() => (
                  <Select
                    label="Relationship"
                    selectedKeys={values.relation ? new Set([values.relation]) : new Set()}
                    onSelectionChange={(keys) => {
                      const selectedKeys = Array.from(keys);
                      setFieldValue('relation', selectedKeys[0]);
                    }}
                    isInvalid={touched.relation && !!errors.relation}
                    errorMessage={touched.relation && errors.relation}
                    variant="bordered"
                    placeholder="Select relationship"
                    isRequired
                  >
                    <SelectItem key="spouse" value="spouse">Spouse</SelectItem>
                    <SelectItem key="child" value="child">Child</SelectItem>
                    <SelectItem key="parent" value="parent">Parent</SelectItem>
                    <SelectItem key="sibling" value="sibling">Sibling</SelectItem>
                    <SelectItem key="other" value="other">Other</SelectItem>
                  </Select>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field name="age">
                  {() => (
                    <Input
                      label="Age"
                      type="number"
                      value={values.age}
                      onChange={(e) => setFieldValue('age', e.target.value)}
                      isInvalid={touched.age && !!errors.age}
                      errorMessage={touched.age && errors.age}
                      variant="bordered"
                      placeholder="Age"
                    />
                  )}
                </Field>

                <Field name="gender">
                  {() => (
                    <Select
                      label="Gender"
                      selectedKeys={values.gender ? new Set([values.gender]) : new Set()}
                      onSelectionChange={(keys) => {
                        const selectedKeys = Array.from(keys);
                        setFieldValue('gender', selectedKeys[0]);
                      }}
                      isInvalid={touched.gender && !!errors.gender}
                      errorMessage={touched.gender && errors.gender}
                      variant="bordered"
                      placeholder="Select gender"
                      isRequired
                    >
                      <SelectItem key="male" value="male">Male</SelectItem>
                      <SelectItem key="female" value="female">Female</SelectItem>
                      <SelectItem key="other" value="other">Other</SelectItem>
                    </Select>
                  )}
                </Field>
              </div>
            </div>
          </div>

          <Field name="contact">
            {() => (
              <Input
                label="Contact Number (Optional)"
                value={values.contact}
                onChange={(e) => setFieldValue('contact', e.target.value)}
                variant="bordered"
                placeholder="Enter phone number"
              />
            )}
          </Field>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button variant="light" onPress={onClose} className="px-6">
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}