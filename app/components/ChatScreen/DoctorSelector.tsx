"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Avatar, Spinner } from "@nextui-org/react";
import { LuSearch, LuArrowLeft, LuMessageCircle } from "react-icons/lu";
import { toast } from "react-hot-toast";

interface Doctor {
  _id: string;
  firstname: string;
  lastname: string;
  profile?: string;
  specialty?: string;
  hospital?: string;
}

interface DoctorSelectorProps {
  onChatRoomCreated: () => void;
  onBack: () => void;
  embedded?: boolean;
}

const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  onChatRoomCreated,
  onBack,
  embedded = false,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = doctors.filter(doctor =>
        `${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchQuery, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/patient/dashboard/doctors-chat-list');
      const result = await response.json();
      
      if (result.success && result.data) {
        setDoctors(result.data);
        setFilteredDoctors(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const createChatRoom = async (doctorId: string) => {
    try {
      setCreating(doctorId);
      
      const response = await fetch('/api/chat/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: doctorId }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Chat started');
        onChatRoomCreated();
      } else {
        throw new Error(result.error || 'Failed to create chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to start chat');
    } finally {
      setCreating(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="light" onPress={onBack}>
              <LuArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold">Select Doctor</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (embedded) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4">
          <Input
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<LuSearch className="w-4 h-4 text-gray-400" />}
            className="mb-4"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LuMessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No doctors found' : 'No assigned doctors'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                {searchQuery 
                  ? 'Try different search terms' 
                  : 'You can only chat with doctors assigned to your approved appointments'
                }
              </p>
              {!searchQuery && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm mx-auto">
                  <h4 className="font-semibold text-blue-900 mb-2">How to get doctors:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 text-left">
                    <li>1. Book an appointment</li>
                    <li>2. Wait for approval</li>
                    <li>3. Doctor gets assigned</li>
                    <li>4. Start chatting!</li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar
                    src={doctor.profile}
                    name={`${doctor.firstname} ${doctor.lastname}`}
                    size="lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Dr. {doctor.firstname} {doctor.lastname}
                    </h3>
                    {doctor.specialty && (
                      <p className="text-sm text-blue-600 font-medium">
                        {doctor.specialty}
                      </p>
                    )}
                    {doctor.hospital && (
                      <p className="text-xs text-gray-500">
                        {doctor.hospital}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    color="primary"
                    onPress={() => createChatRoom(doctor._id)}
                    isLoading={creating === doctor._id}
                    disabled={creating !== null}
                    startContent={!creating && <LuMessageCircle className="w-4 h-4" />}
                  >
                    {creating === doctor._id ? 'Starting...' : 'Chat'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <Button isIconOnly variant="light" onPress={onBack}>
            <LuArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Select Doctor</h2>
            <p className="text-sm text-gray-600">Choose a doctor to start chatting</p>
          </div>
        </div>
        
        <Input
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<LuSearch className="w-4 h-4 text-gray-400" />}
        />
      </div>

      {/* Doctors List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <LuMessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No doctors found' : 'No assigned doctors'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              {searchQuery 
                ? 'Try different search terms' 
                : 'You can only chat with doctors assigned to your approved appointments'
              }
            </p>
            {!searchQuery && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
                <h4 className="font-semibold text-blue-900 mb-2">How to get doctors:</h4>
                <ol className="text-sm text-blue-800 space-y-1 text-left">
                  <li>1. Book an appointment</li>
                  <li>2. Wait for approval</li>
                  <li>3. Doctor gets assigned</li>
                  <li>4. Start chatting!</li>
                </ol>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar
                  src={doctor.profile}
                  name={`${doctor.firstname} ${doctor.lastname}`}
                  size="lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Dr. {doctor.firstname} {doctor.lastname}
                  </h3>
                  {doctor.specialty && (
                    <p className="text-sm text-blue-600 font-medium">
                      {doctor.specialty}
                    </p>
                  )}
                  {doctor.hospital && (
                    <p className="text-xs text-gray-500">
                      {doctor.hospital}
                    </p>
                  )}
                </div>
                
                <Button
                  color="primary"
                  onPress={() => createChatRoom(doctor._id)}
                  isLoading={creating === doctor._id}
                  disabled={creating !== null}
                  startContent={!creating && <LuMessageCircle className="w-4 h-4" />}
                >
                  {creating === doctor._id ? 'Starting...' : 'Chat'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSelector;