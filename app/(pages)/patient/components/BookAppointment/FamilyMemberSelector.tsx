import { Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";
import { useFamilyMembers } from "@lib/hooks/use-locations";
import { FaPlus, FaUser } from "react-icons/fa";
import AddFamilyMemberForm from "./AddFamilyMemberForm";

interface FamilyMemberSelectorProps {
  selectedMember: string;
  onMemberChange: (memberId: string) => void;
}

export function FamilyMemberSelector({ selectedMember, onMemberChange }: FamilyMemberSelectorProps) {
  const { familyMembers, loading, refetch } = useFamilyMembers();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Book appointment for</label>
        <Button
          size="sm"
          onPress={onOpen}
          startContent={<FaPlus className="text-xs" />}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs font-medium px-4 py-2 rounded-xl border-0"
        >
          Add Member
        </Button>
      </div>
      
      <Select
        label="Patient"
        placeholder="Select who this appointment is for"
        selectedKeys={selectedMember ? new Set([selectedMember]) : new Set()}
        onSelectionChange={(keys) => {
          const selectedKeys = Array.from(keys);
          const selected = selectedKeys[0] as string;
          onMemberChange(selected);
        }}
        isLoading={loading}
        variant="bordered"
        startContent={<FaUser className="text-gray-400" />}
        isRequired
        renderValue={(items) => {
          if (!items || items.length === 0) return "Select who this appointment is for";
          const item = items[0];
          if (item.key === "self") return "Myself";
          const member = familyMembers.find((m: any) => m._id === item.key);
          if (member) {
            return `${member.name} (${member.relation.charAt(0).toUpperCase() + member.relation.slice(1)}, ${member.age}y)`;
          }
          return "Select who this appointment is for";
        }}
      >
        <SelectItem key="self" value="self" textValue="Myself">
          Myself
        </SelectItem>
        {familyMembers.map((member: any) => (
          <SelectItem 
            key={member._id} 
            value={member._id}
            textValue={`${member.name} (${member.relation.charAt(0).toUpperCase() + member.relation.slice(1)}, ${member.age}y)`}
          >
            {member.name} ({member.relation.charAt(0).toUpperCase() + member.relation.slice(1)}, {member.age}y)
          </SelectItem>
        ))}
      </Select>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent className="bg-white">
          <ModalHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FaUser className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Add Family Member</h3>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            <AddFamilyMemberForm onClose={() => onOpenChange()} onSuccess={() => refetch()} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}