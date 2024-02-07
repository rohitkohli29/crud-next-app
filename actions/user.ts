'use server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'


function checkEmptyOrPhoneField(requiredFields: string[], data: object, char: string[]) {
    for (let i = 0; i < requiredFields.length; i++) {
        if (data[requiredFields[i]].length == 0) {
            return {
                fieldName: requiredFields[i],
                message: 'Field data properly',
                status: 402
            }
        } else if (requiredFields[i] == 'email') {
            if (data[requiredFields[i]].indexOf('@') == -1) {
                return {
                    fieldName: requiredFields[i],
                    message: 'Invalid Email',
                    status: 402
                }
            }
        } else if (requiredFields[i] == 'phone') {
            if (data[requiredFields[i]].length != 10) {
                return {
                    fieldName: requiredFields[i],
                    message: 'Invalid Phone Number',
                    status: 402
                }
            } else {
                for (let j = 0; j < char.length; j++) {
                    if (data[requiredFields[i]].indexOf(char[j]) != -1) {
                        return {
                            fieldName: requiredFields[i],
                            message: 'Char is not allowed is phone number',
                            status: 402
                        }
                    }
                }
            }
        }
    }

    return {
        message: 'Everything is good',
        status: 200
    }
}
function checkInputFieldContainNumberOrNot(data: object, numexp: string[], requiredFields: string[]) {
    for (let i = 0; i < numexp.length; i++) {
        for (let j = 0; j < requiredFields.length; j++) {
            if (requiredFields[j] != 'phone' && requiredFields[j] != 'email') {
                if (data[requiredFields[j]].indexOf(numexp[i]) != -1) {
                    return {
                        fieldName: requiredFields[j],
                        message: `Number is not allowed in ${requiredFields[j]} field`,
                        status: 402
                    }
                }
            }
        }
    }

    return {
        message: 'Everything is good',
        status: 200
    }
}

export async function addUser(formData: FormData) {
    const numexp = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const char = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'w', 'x', 'y', 'z']
    const requiredFields = ['name', 'email', 'phone', 'country', 'jobtype'];

    const data = {
        name: formData.get('name').toString(),
        email: formData.get('email').toString(),
        phone: formData.get('phone').toString(),
        country: formData.get('country').toString(),
        jobtype: formData.get('role').toString(),
    }

    // verify the any input fields is empty or not and phone is contain char or not
    const res = checkEmptyOrPhoneField(requiredFields, data, char);
    // verify the fields they is contain number or not
    const res2 = checkInputFieldContainNumberOrNot(data, numexp, requiredFields);

    if(res.status != 200){
        return res;
    }
    
    if(res2.status != 200){
        return res2;
    }

    await fetch(process.env.SECRET_API_KEY!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...data })
    })

    revalidateTag('users');
}


// Update the user
export async function updateUser(userId: any, formData: FormData) {
    const name = formData.get('name');
    const jobtype = formData.get('jobtype');
    const phone = formData.get('phone');
    const country = formData.get('country');

    const updated_data = {
        name,
        jobtype,
        phone,
        country
    }

    await fetch(`${process.env.SECRET_API_KEY!}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated_data)
    })

    revalidateTag('users');
    redirect('/');
}


// Delete the user 
export async function deleteUser(userId: any) {
    await fetch(`${process.env.SECRET_API_KEY!}/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    revalidateTag('users');
}