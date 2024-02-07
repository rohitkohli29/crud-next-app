'use client'
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Input,Tooltip } from "@nextui-org/react";
import { addUser } from "@/actions/user";
import SubmitButton from "./ui/SubmitButton";
import AddIcon from './ui/AddIcon';
import toast from "react-hot-toast";
export default function UiModal(){
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const formAction = async (formData:FormData) => {
        const res: any = await addUser(formData);
        if(res?.status == 402) toast.error(res.message);
        else toast.success('Everything is good')
    }

    
    return (
        <>
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Tooltip content={"Add User"} color="primary" placement="bottom">
                    <button className="px-4 sm:px-8 pt-[0.75rem] pb-[1rem] bg-white rounded-md focus:bg-grey-100 flex items-center justify-center" onClick={() => onOpen()}><AddIcon /></button>
                </Tooltip>
            </span>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add User</ModalHeader>
                            <ModalBody>
                                <form action={formAction} className="flex flex-col gap-y-2">
                                    <Input type="text" name="name" label='Name: - ' placeholder="User name.." aria-required={true} required></Input>
                                    <Input type="email" name="email" label='Email: - ' placeholder="User email.." aria-required={true} required></Input>
                                    <Input type="text" name="role" label='Role: - ' placeholder="User job role.." aria-required={true} required></Input>
                                    <Input type="tel" name="phone" label='Phone: - ' placeholder="User phone.." aria-required={true} required></Input>
                                    <Input type="text" name="country" label='Country: - ' placeholder="User country.." aria-required={true} required></Input>
                                    <SubmitButton />
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
