import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";
import SignOutButton from "../SignOutButton";
import { Doc } from "../../convex/_generated/dataModel";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const { toast } = useToast();

  // Queries
  const appointments = useQuery(api.appointments.list) || [];
  const patients = useQuery(api.patients.list) || [];
  const doctors = useQuery(api.doctors.list) || [];

  // Stats
  const totalAppointments = appointments.length;
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const completedAppointments = appointments.filter(app => app.status === "completed").length;

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <h3 className="text-lg font-medium mb-2">إجمالي المواعيد</h3>
        <p className="text-3xl font-bold">{totalAppointments}</p>
      </div>
      <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
        <h3 className="text-lg font-medium mb-2">المواعيد المكتملة</h3>
        <p className="text-3xl font-bold">{completedAppointments}</p>
      </div>
      <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <h3 className="text-lg font-medium mb-2">المرضى</h3>
        <p className="text-3xl font-bold">{totalPatients}</p>
      </div>
      <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <h3 className="text-lg font-medium mb-2">الأطباء</h3>
        <p className="text-3xl font-bold">{totalDoctors}</p>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {tab.icon}
              <span>{tab.name}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "appointments":
        return <AppointmentsSection appointments={appointments} />;
      case "patients":
        return <PatientsSection patients={patients} />;
      case "doctors":
        return <DoctorsSection doctors={doctors} />;
      case "reports":
        return <ReportsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">نظام إدارة العيادة</h1>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStats()}
        {renderTabs()}
        {renderContent()}
      </main>
    </div>
  );
};

interface AppointmentsSectionProps {
  appointments: Doc<"appointments">[];
}

function AppointmentsSection({ appointments }: AppointmentsSectionProps) {
  const updateAppointment = useMutation(api.appointments.update);
  const { toast } = useToast();

  const handleStatusUpdate = async (id: Doc<"appointments">["_id"], status: "pending" | "completed" | "cancelled") => {
    try {
      await updateAppointment({ id, status });
      toast({
        title: "تم تحديث الموعد",
        description: "تم تحديث حالة الموعد بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الموعد",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">المواعيد</h2>
        <button className="btn-primary">موعد جديد</button>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.date).toLocaleDateString('ar-SA')} - {appointment.time}
                </p>
                <p className="text-sm text-gray-500">الطبيب: {appointment.doctorName}</p>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <select
                  value={appointment.status}
                  onChange={(e) => handleStatusUpdate(appointment._id, e.target.value as "pending" | "completed" | "cancelled")}
                  className="select text-sm"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PatientsSectionProps {
  patients: Doc<"patients">[];
}

function PatientsSection({ patients }: PatientsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">المرضى</h2>
        <button className="btn-primary">إضافة مريض</button>
      </div>

      <div className="grid gap-4">
        {patients.map((patient) => (
          <div key={patient._id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">رقم الهاتف: {patient.phone || patient.phoneNumber}</p>
                <p className="text-sm text-gray-500">العمر: {patient.age} سنة</p>
              </div>
              <button className="btn-secondary text-sm">عرض السجل الطبي</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DoctorsSectionProps {
  doctors: Doc<"doctors">[];
}

function DoctorsSection({ doctors }: DoctorsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">الأطباء</h2>
        <button className="btn-primary">إضافة طبيب</button>
      </div>

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">د. {doctor.name}</h3>
                <p className="text-sm text-gray-500">التخصص: {doctor.specialization}</p>
                <p className="text-sm text-gray-500">المواعيد المتاحة: {doctor.availableDays?.join(", ")}</p>
              </div>
              <button className="btn-secondary text-sm">عرض الجدول</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">التقارير والإحصائيات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium mb-4">المواعيد الأسبوعية</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            [مخطط المواعيد الأسبوعية]
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-4">توزيع المرضى حسب العمر</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            [مخطط توزيع المرضى]
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-4">إحصائيات الأطباء</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            [مخطط إحصائيات الأطباء]
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-4">معدل رضا المرضى</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            [مخطط رضا المرضى]
          </div>
        </div>
      </div>
    </div>
  );
}

const tabs = [
  {
    id: "appointments",
    name: "المواعيد",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "patients",
    name: "المرضى",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
  },
  {
    id: "doctors",
    name: "الأطباء",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "reports",
    name: "التقارير",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default Dashboard;
