import React, { useState , useEffect } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "../components/Custom/Button";
import DataTable from "../components/Custom/DataTable";
import AddSaveNum from "../components/AddSaveNum";
import axios from "axios";
 

export default function Notebooks() {
  
  function parseJwt (token){
    try{
      return JSON.parse(atob(token.split(".")[1]));
    }catch{
      return null;
    }
  }
  const token = localStorage.getItem('token')
    const decoded = parseJwt(token);
    const email = decoded?.email;
  

  const [selectedRows, setSelectedRows] = useState([]);
  const[formData, setFormData]=useState([])
  const [loading, setLoading] = useState(true); // حالة التحميل
  const[checNumber , setChecNumber]=useState()
    const [showForm, setShowForm] = useState(false); // ✅ حالة لعرض النموذج
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
      
  useEffect(()=>{
    console.log("aaaaaaaaa")
    const handleData = async()=>{
      setLoading(true); // بدء التحميل
      try{
        const res = await axios.get(`https://paynet-1.onrender.com/api/payment/save-number?email=${email}`)
        console.log("البيانات المسترجعة:", res.data)
        console.log("بنية البيانات:", JSON.stringify(res.data, null, 2))
        setFormData(res.data || []) // تأكد من أن البيانات مصفوفة
        setSelectedRows([]) // إعادة تعيين الـ checkboxes المحددة

      }catch(err){
        console.log("خطأ في جلب البيانات:", err)
        setFormData([]) // في حالة الخطأ، اجعل البيانات مصفوفة فارغة
      }finally{
        setLoading(false); // انتهاء التحميل
      }
    }
    
    if(email) { // تأكد من وجود email قبل الاستدعاء
      handleData();
    }else{
      setLoading(false); // إذا لم يكن هناك email، توقف التحميل
    }

  },[email])  

  // دالة لإعادة تحميل البيانات
  const refreshData = async () => {
    setLoading(true);
    try{
      const res = await axios.get(`https://paynet-1.onrender.com/api/payment/save-number?email=${email}`)
      console.log("تم إعادة تحميل البيانات:", res.data)
      setFormData(res.data || [])
      setSelectedRows([]) // إعادة تعيين الـ checkboxes المحددة
    }catch(err){
      console.log("خطأ في إعادة تحميل البيانات:", err)
      setFormData([])
    }finally{
      setLoading(false);
    }
  }


  // تعريف الأعمدة
  const notebookColumns = [
    {
      key: "select",
      label: "✔",
      render: (row, index) => {
        // استخدام index كـ unique identifier إذا لم يكن هناك id
        const uniqueId = row.id || row._id || index;
        return (
          <input
            type="checkbox"
            checked={selectedRows.includes(uniqueId)}
            onChange={() => {
              if (selectedRows.includes(uniqueId)) {
                setSelectedRows(selectedRows.filter((id) => id !== uniqueId));
              } else {
                setSelectedRows([...selectedRows, uniqueId]);
              }
            }}
          />
        );
      },
    },
    { 
      key: "landline", 
      label: "الرقم",
      render: (row) => {
        const rowId = row._id || row.id || row.landline;
        if (editingId === rowId) {
          return (
            <input
              className="w-28 border p-1 rounded text-center"
              value={editedRow.landline ?? ""}
              onChange={(e) => setEditedRow({ ...editedRow, landline: e.target.value })}
            />
          );
        }
        return row.landline;
      }
    },
    { 
      key: "company", 
      label: "الشركة",
      render: (row) => {
        const rowId = row._id || row.id || row.landline;
        if (editingId === rowId) {
          return (
            <input
              className="w-28 border p-1 rounded text-center"
              value={editedRow.company ?? ""}
              onChange={(e) => setEditedRow({ ...editedRow, company: e.target.value })}
            />
          );
        }
        return row.company;
      }
    },
    {
      key: "createdAt",
      label: "تاريخ الإنشاء",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString("ar-SY", {
          dateStyle: "medium",
        }),
    },
    {
      key: "date",
      label: "تاريخ التسديد",
      render: (row) => {
        const rowId = row._id || row.id || row.landline;
        if (editingId === rowId) {
          const value = editedRow.date ? new Date(editedRow.date).toISOString().slice(0,10) : "";
          return (
            <input
              type="date"
              className="w-36 border p-1 rounded text-center"
              value={value}
              onChange={(e) => setEditedRow({ ...editedRow, date: e.target.value })}
            />
          );
        }
        return new Date(row.date).toLocaleDateString("ar-SY", { dateStyle: "medium" });
      }
    },
    {
      key: "amount",
      label: "المبلغ",
      render: (row) => {
        const rowId = row._id || row.id || row.landline;
        if (editingId === rowId) {
          return (
            <input
              type="number"
              className="w-28 border p-1 rounded text-center"
              value={editedRow.amount ?? 0}
              onChange={(e) => setEditedRow({ ...editedRow, amount: Number(e.target.value) })}
            />
          );
        }
        return `${row.amount.toLocaleString()} ل.س`;
      }
    },
    { 
      key: "speed", 
      label: "السرعة",

    },
    {
      key: "actions",
      label: "اجراءات",
      render: (row) => {
        const rowId = row._id || row.id || row.landline;
        const isEditing = editingId === rowId;
        return (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  className="bg-emerald-600 text-white text-xs px-2 py-1 hover:bg-emerald-700"
                  variant="outline"
                  onClick={() => saveEdit(rowId)}
                >
                  حفظ
                </Button>
                <Button
                  className="bg-gray-400 text-white text-xs px-2 py-1 hover:bg-gray-500"
                  variant="outline"
                  onClick={cancelEdit}
                >
                  إلغاء
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-green-500 text-white text-xs px-2 py-1 hover:bg-green-700"
                  variant="outline"
                  onClick={() => startEdit(row)}
                >
                  تعديل
                </Button>
                <Button
                  className="bg-red-500 text-white text-xs px-2 py-1 hover:bg-red-700"
                  variant="outline"
                  onClick={() => deleteSaved(row)}
                >
                  حذف
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const selectNum = async()=>{
    // الحصول على الأرقام المحددة فقط

    const selectedNumbers = formData.filter((row , index) => {
      const uniqueId = row.id || row._id || index;
      return selectedRows.includes(uniqueId);
    });
    
    console.log("الأرقام المحددة:", selectedNumbers);
    console.log("عدد الأرقام المحددة:", selectedNumbers.length);
    
    // طباعة الأرقام فقط
    const numbers = selectedNumbers.map(row => row.landline);
    console.log("الأرقام:", numbers);
    
    // إذا لم يتم تحديد أي رقم
    if (selectedNumbers.length === 0) {
      alert("لم يتم تحديد أي رقم");
      return;
    }
    
    try {
      // إرسال الأرقام المحددة إلى API للتسديد
      const response = await axios.post(
        'https://paynet-1.onrender.com/api/payment/pay-selected',
        {
          email: email,
          numbers: numbers,
          selectedData: selectedNumbers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("استجابة التسديد:", response.data);
      alert(`تم تسديد ${selectedNumbers.length} رقم بنجاح: ${numbers.join(', ')}`);
      
      // إعادة تحميل البيانات وإعادة تعيين التحديد
      await refreshData();
      
    } catch (error) {
      console.error("خطأ في تسديد الأرقام:", error);
      alert("حدث خطأ في تسديد الأرقام. حاول مرة أخرى.");
    }
  }

  const startEdit = (row) => {
    const rowId = row._id || row.id || row.landline;
    setEditingId(rowId);
    setEditedRow({
      _id: row._id,
      id: row.id,
      landline: row.landline,
      company: row.company,
      date: row.date,
      amount: row.amount,
      speed: row.speed,
    });
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditedRow({});
  }

  const saveEdit = async (rowId) => {
    try {
      await axios.put(
        `https://paynet-1.onrender.com/api/payment/save-number/${rowId}`,
        {
          landline: editedRow.landline,
          company: editedRow.company,
          date: editedRow.date,
          amount: editedRow.amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cancelEdit();
      await refreshData();
    } catch (error) {
      console.error("خطأ في حفظ التعديلات:", error);
      alert("تعذر حفظ التعديلات. حاول لاحقاً.");
    }
  }

  const deleteSaved = async (row) => {
    const confirm = window.confirm("هل انت متاكد من حذف الرقم")
    if(!confirm)   return;

    try {
      await axios.delete(
        `https://paynet-1.onrender.com/api/payment/save-number/${row._id || row.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { email },
        }
      );
      alert("تم حذف الرقم من القائمة");
      await refreshData();
    } catch (error) {
      console.error("خطأ في حذف الرقم:", error);
      alert("تعذر حذف الرقم.");
    }
  }

  return (
    <div>
      <ScreenWrapper>
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-xl font-bold text-center">
            اضافة الارقام التي يتم تسديدها بشكل دائم
          </h1>
          <div className="w-full flex justify-between px-4">
            <div className="flex gap-2">
              <Button
                className="bg-blue-400 text-white text-sm" 
                variant="outline"
                onClick={() => {
                  const allIds = formData.map((row, index) => row.id || row._id || index);
                  setSelectedRows(allIds);
                }}
                disabled={formData.length === 0}
              >
                تحديد الكل
              </Button>
              <Button
                className="bg-gray-400 text-white text-sm" 
                variant="outline"
                onClick={() => setSelectedRows([])}
                disabled={selectedRows.length === 0}
              >
                إلغاء تحديد الكل
              </Button>
            </div>
            <Button
             className="bg-violet-400 text-white" 
             variant="outline"
             onClick={()=>{setShowForm(true)}}
             >
              اضافة رقم
            </Button>
          </div>

          {showForm && (
            
            <AddSaveNum  
              onClose={()=>{setShowForm(false)}}
              onSuccess={refreshData}
            />
          )}
          {/* ✅ الجدول أسفل الزر */}
          <div className="w-full px-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
                <p className="text-gray-500 text-lg mt-4">
                  جاري تحميل البيانات...
                </p>
              </div>
            ) : formData.length > 0 ? (
              <DataTable
                columns={notebookColumns}
                data={formData}
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  لا توجد أرقام محفوظة حالياً
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  اضغط على "اضافة رقم" لإضافة رقم جديد
                </p>
              </div>
            )}
          </div>
           <div className="w-full px-4 mt-4">
             <Button 
               onClick={()=>{selectNum()}}
               className="bg-green-500 text-white w-full"
               disabled={selectedRows.length === 0}
             >
               تسديد الأرقام المحددة ({selectedRows.length})
             </Button>
           </div>

        </div>
      </ScreenWrapper>
    </div>
  );
}
