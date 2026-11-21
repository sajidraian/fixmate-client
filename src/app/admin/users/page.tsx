"use client";
import { useEffect, useState } from "react";
import { authenticatedFetch } from "@/lib/api";
import { useConfirm } from "@/components/ConfirmProvider";

type User = { _id:string; name:string; email:string; image?:string; role:string; createdAt?:string };

export default function AdminUsersPage(){
  const confirm = useConfirm();
  const [users,setUsers]=useState<User[]>([]);
  const [loading,setLoading]=useState(true);
  const [savingId,setSavingId]=useState("");
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [page,setPage]=useState(1);
  const [totalPages,setTotalPages]=useState(1);

  const load=async()=>{
    try {
      const response=await authenticatedFetch("/api/admin/users?page="+page+"&limit=10");
      setUsers(response.data||[]);
      setTotalPages(Math.max(1,Number(response.pagination?.totalPages)||1));
    } catch(e) {
      setError(e instanceof Error?e.message:"Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ void load(); },[page]);

  const changeRole=async(user:User,role:string)=>{
    if(!["customer","technician","admin"].includes(role) || role===user.role) return;
    const accepted = await confirm({ title: "Change user role?", message: "Confirm changing " + user.name + " from " + user.role + " to " + role + "?", confirmLabel: "Change role", danger: role === "admin" });
    if (!accepted) return;
    setError("");
    setNotice("");
    setSavingId(user._id);
    try {
      await authenticatedFetch(`/api/admin/users/${user._id}/role`,{
        method:"PATCH",
        body:JSON.stringify({role}),
      });
      setUsers(current=>current.map(item=>item._id===user._id?{...item,role}:item));
      setNotice(`${user.name}'s role was updated to ${role}.`);
    } catch(e) {
      setError(e instanceof Error?e.message:"Role update failed.");
    } finally {
      setSavingId("");
    }
  };

  return <main className="min-h-screen bg-[#080D19] px-5 py-10 text-white">
    <div className="mx-auto max-w-7xl">
      <a href="/dashboard/admin" className="text-[#B8F36B]">← Admin Dashboard</a>
      <h1 className="mt-6 text-3xl font-black">Manage Users</h1>
      <p className="mt-2 text-gray-400">Review platform accounts and assign roles.</p>
      {error&&<p role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</p>}
      {notice&&<p role="status" className="mt-5 rounded-xl border border-[#B8F36B]/20 bg-[#B8F36B]/10 p-4 text-[#B8F36B]">{notice}</p>}
      {loading?<p className="mt-8 text-gray-400">Loading users…</p>:<div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#111B2D] text-gray-300"><tr>{["User","Email","Role","Joined","Change Role"].map(label=><th key={label} className="p-4">{label}</th>)}</tr></thead>
          <tbody>{users.map(user=><tr key={user._id} className="border-t border-white/10">
            <td className="p-4"><div className="flex items-center gap-3">{user.image?<img src={user.image} alt="" className="h-9 w-9 rounded-full object-cover"/>:<span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">{user.name?.[0]||"U"}</span>}<span>{user.name}</span></div></td>
            <td className="p-4 text-gray-300">{user.email}</td>
            <td className="p-4 capitalize">{user.role}</td>
            <td className="p-4 text-gray-400">{user.createdAt?new Date(user.createdAt).toLocaleDateString():"—"}</td>
            <td className="p-4"><select aria-label={`Change role for ${user.name}`} value={user.role} disabled={savingId===user._id||Boolean(savingId)} onChange={event=>void changeRole(user,event.target.value)} className="rounded-lg border border-white/10 bg-[#111B2D] p-2 disabled:opacity-50"><option value="customer">Customer</option><option value="technician">Technician</option><option value="admin">Admin</option></select>{savingId===user._id&&<span className="ml-2 text-xs text-gray-400">Saving…</span>}</td>
          </tr>)}</tbody>
        </table>
        {!users.length&&<p className="p-8 text-center text-gray-400">No users found.</p>}
        {totalPages>1&&<div className="flex items-center justify-center gap-4 border-t border-white/10 p-4"><button onClick={()=>setPage(value=>Math.max(1,value-1))} disabled={page===1} className="rounded-lg border border-white/15 px-4 py-2 disabled:opacity-40">Previous</button><span className="text-sm text-gray-400">Page {page} of {totalPages}</span><button onClick={()=>setPage(value=>Math.min(totalPages,value+1))} disabled={page===totalPages} className="rounded-lg border border-white/15 px-4 py-2 disabled:opacity-40">Next</button></div>}
      </div>}
    </div>
  </main>;
}
