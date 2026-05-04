'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/lib/firebase/client';
import { loginWithGoogle, logout } from '@/lib/auth';
import { createOrUpdateBlog, deleteBlog, getUserProfile, subscribeAllBlogs, subscribeUsers, updateUserRoleOrStatus } from '@/lib/firestore';
import type { BlogPost, UserProfile } from '@/types/models';
import { GlassCard } from '@/components/ui/GlassCard';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [staticOwnerAccess, setStaticOwnerAccess] = useState(false);
  const [ownerLoginStep, setOwnerLoginStep] = useState<1 | 2>(1);

  const [activeTab, setActiveTab] = useState<'blogs' | 'users'>('blogs');
  
  // Blog State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);

  // Users State
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const activeProfile = staticOwnerAccess ? { uid: '9026240970', fullName: 'System Owner', role: 'admin' as any } : profile;

  useEffect(() => {
    if (activeProfile?.role === 'admin' || (activeProfile?.role as any) === 'author') {
      const unsub = subscribeAllBlogs(setBlogs);
      return () => unsub();
    }
  }, [activeProfile]);

  useEffect(() => {
    if (activeProfile?.role === 'admin') {
      const unsub = subscribeUsers(setUsers);
      return () => unsub();
    }
  }, [activeProfile]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeProfile) return;
    const form = new FormData(e.currentTarget);
    const data: Partial<BlogPost> = {
      id: editingBlog?.id,
      title: String(form.get('title') || ''),
      slug: String(form.get('slug') || ''),
      category: String(form.get('category') || 'Marketing') as any,
      excerpt: String(form.get('excerpt') || ''),
      content: String(form.get('content') || ''),
      status: (form.get('status') as any) || 'draft',
      createdBy: editingBlog?.createdBy || activeProfile?.uid,
    };

    try {
      await createOrUpdateBlog(data as any);
      alert('Saved successfully!');
      setEditingBlog(null);
    } catch (err) {
      alert('Error saving blog.');
      console.error(err);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-lg font-bold text-fg/60">Loading Workspace...</div>;

  const handleStaticOwnerLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    
    if (ownerLoginStep === 1) {
      const id = String(form.get('id'));
      const pass = String(form.get('pass'));
      if (id === '9026240970' && (pass === '6393' || pass === '6397')) {
        setOwnerLoginStep(2);
      } else {
        alert('Invalid ID or Password.');
      }
    } else {
      const code = String(form.get('code'));
      if (code === '6393') {
        setStaticOwnerAccess(true);
      } else {
        alert('Invalid Authenticator Code.');
      }
    }
  };

  if (!currentUser && !staticOwnerAccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center mt-12 mb-20 bg-background">
        
        {/* Sleek Owner Login Module */}
        <div className="w-full max-w-[400px] mb-8 relative group">
           <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-[#171717] via-purple-500 to-pink-500 opacity-25 blur-xl group-hover:opacity-40 transition duration-500" />
           <div className="relative rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-8 shadow-2xl text-left overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#171717] to-purple-500" />
             
             <h2 className="text-2xl font-extrabold tracking-tight text-white mb-6 flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#171717]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
               System Owner Login
             </h2>
             
             <form onSubmit={handleStaticOwnerLogin} className="flex flex-col gap-5 transition-all animate-in fade-in duration-300">
               {ownerLoginStep === 1 ? (
                 <>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Owner ID</label>
                     <input name="id" required placeholder="Enter ID..." className="h-14 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-[#171717]/50 focus:ring-1 focus:ring-accent/50 transition-all shadow-inner" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Secure Passcode</label>
                     <input name="pass" type="password" required placeholder="Enter Password..." className="h-14 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-[#171717]/50 focus:ring-1 focus:ring-accent/50 transition-all shadow-inner" />
                   </div>
                   <button type="submit" className="w-full h-14 rounded-xl bg-white text-black mt-2 font-bold transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                     Verify Credentials
                   </button>
                 </>
               ) : (
                 <>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs font-bold uppercase tracking-widest text-[#171717] ml-1">2FA Authenticator Code</label>
                     <input name="code" required placeholder="Enter 4-Digit Code" className="h-[72px] rounded-xl border border-[#171717]/30 bg-[#171717]/10 text-center tracking-[0.2em] text-2xl font-mono font-bold text-white placeholder:text-white/20 outline-none focus:border-[#171717] focus:bg-[#171717]/20 transition-all shadow-inner" />
                   </div>
                   <button type="submit" className="w-full h-14 rounded-xl bg-[#171717] mt-2 font-bold text-white transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]">
                     Unlock System Access
                   </button>
                   <button type="button" onClick={() => setOwnerLoginStep(1)} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white mt-3 text-center transition-colors">
                     &larr; Back to ID Input
                   </button>
                 </>
               )}
             </form>
          </div>
        </div>

        <div className="flex items-center w-full max-w-[400px] gap-4 opacity-50 my-2">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Or Author Login</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Standard Google Author Login */}
        <div className="w-full max-w-[400px] mt-4">
          <button onClick={handleLogin} className="w-full h-14 rounded-xl border border-white/10 bg-white/5 font-semibold text-white transition hover:bg-white/10 flex items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
        </div>

      </div>
    );
  }

  if (activeProfile?.role !== 'admin' && (activeProfile?.role as any) !== 'author') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <GlassCard className="max-w-md p-10 !rounded-[2rem]">
          <h1 className="text-3xl font-extrabold mb-4 text-white">Access Denied</h1>
          <p className="mb-8 text-white/60 font-medium">Your account is active but lacks author privileges. Contact the administrator to upgrade your role.</p>
          <button onClick={() => { setStaticOwnerAccess(false); logout(); }} className="text-sm font-bold text-[#171717] uppercase tracking-widest hover:text-white transition-colors">Sign Out</button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 pt-24 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Content Workspace</h1>
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <p className="text-sm font-medium text-white/50">Authenticated as <span className="text-white">{activeProfile?.fullName}</span> <span className="uppercase tracking-widest text-[10px] ml-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">{activeProfile?.role}</span></p>
          </div>
        </div>
        <button onClick={() => { setStaticOwnerAccess(false); logout(); }} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 bg-red-500/10 px-4 py-2 rounded-full transition-colors border border-red-500/20">End Session</button>
      </div>

      <div className="flex gap-3 mb-10 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10">
        <button className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'blogs' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'}`} onClick={() => setActiveTab('blogs')}>Articles CMS</button>
        {activeProfile?.role === 'admin' && (
          <button className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'}`} onClick={() => setActiveTab('users')}>Members Access</button>
        )}
      </div>

      {activeTab === 'blogs' && (
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Manage Articles</h2>
              <button 
                onClick={() => setEditingBlog({})} 
                className="bg-[#171717]/10 border border-[#171717]/30 text-[#171717] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#171717] hover:text-white transition-all"
              >
                + Write New
              </button>
            </div>
            
            <div className="space-y-4">
              {blogs.map(b => (
                <div key={b.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/20 border border-white/10 rounded-2xl backdrop-blur-md transition-all hover:bg-white/5 hover:border-white/20 group">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-bold text-white text-lg mb-1">{b.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${b.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                        {b.status}
                      </span>
                      <span className="text-xs font-semibold text-white/40">{b.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingBlog(b)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors border border-white/5">Edit</button>
                    <button onClick={() => deleteBlog(b.id)} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm transition-colors border border-red-500/20">Delete</button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && <p className="text-sm font-medium text-white/40 italic p-4 bg-white/5 rounded-2xl border border-white/5 text-center">No articles written yet. Click 'Write New'.</p>}
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 text-white tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#171717]/20 border border-[#171717]/30 flex items-center justify-center text-[#171717]">✎</span>
                {editingBlog?.id ? 'Edit Article' : 'Draft New Article'}
              </h2>
              
              {!editingBlog ? (
                <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                   <p className="text-white/40 font-semibold mb-2">Editor Workspace</p>
                   <p className="text-sm text-white/30 text-center max-w-[200px]">Select an article from the left panel to edit, or click "+ Write New".</p>
                </div>
              ) : (
                <form onSubmit={handleBlogSubmit} className="flex flex-col gap-5 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-1.5 col-span-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Headline</label>
                       <input name="title" required placeholder="Catchy Title" defaultValue={editingBlog.title} className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white font-semibold outline-none focus:border-[#171717] focus:bg-white/5 transition-colors placeholder:text-white/20 shadow-inner" />
                     </div>
                     <div className="flex flex-col gap-1.5 col-span-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">URL Slug</label>
                       <input name="slug" required placeholder="url-friendly-slug-format" defaultValue={editingBlog.slug} className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-[#171717] outline-none focus:border-[#171717] focus:bg-white/5 transition-colors placeholder:text-white/20 shadow-inner" />
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Folder</label>
                       <select name="category" defaultValue={editingBlog.category} className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white font-semibold outline-none focus:border-[#171717] focus:bg-white/5 transition-colors appearance-none shadow-inner">
                         <option value="Marketing">Marketing</option>
                         <option value="Analytics">Analytics</option>
                         <option value="Design">Design</option>
                         <option value="Case Study">Case Study</option>
                       </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Visibility</label>
                       <select name="status" defaultValue={editingBlog.status} className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white font-semibold outline-none focus:border-[#171717] focus:bg-white/5 transition-colors appearance-none shadow-inner">
                         <option value="draft">Draft (Hidden)</option>
                         <option value="published">Published</option>
                       </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Preview Excerpt</label>
                     <textarea name="excerpt" placeholder="Short preview text for the blog grid..." defaultValue={editingBlog.excerpt} className="w-full h-24 rounded-2xl border border-white/10 bg-black/40 p-4 text-white font-medium min-h-24 max-h-32 resize-none outline-none focus:border-[#171717] focus:bg-white/5 transition-colors placeholder:text-white/20 shadow-inner" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Main Content (Markdown)</label>
                     <textarea name="content" required placeholder="Write your full markdown/html content here. Tell an engaging story." defaultValue={editingBlog.content} className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-sm text-white/90 resize-y outline-none focus:border-[#171717] focus:bg-white/5 transition-colors placeholder:text-white/20 shadow-inner leading-relaxed" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                    <button type="submit" className="flex-1 rounded-2xl bg-white p-4 font-bold text-black transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">Save Article</button>
                    <button type="button" onClick={() => setEditingBlog(null)} className="w-full sm:w-auto px-8 rounded-2xl border border-white/10 bg-white/5 p-4 font-bold text-white/60 transition hover:bg-white/10 hover:text-white">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && activeProfile?.role === 'admin' && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 flex flex-col gap-3 border border-[#171717]/30 bg-[#171717]/5 p-8 rounded-[2rem] shadow-[0_0_30px_rgba(99,102,241,0.05)] backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#171717]/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
            <h2 className="text-2xl font-extrabold flex items-center gap-3 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#171717]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Assign New Members
            </h2>
            <p className="text-base font-medium text-white/70 leading-relaxed max-w-2xl relative z-10">
              To securely onboard a new Author or Admin, ask them to visit this secret page URL and click <strong className="text-white bg-white/10 px-2 py-0.5 rounded-md">Continue with Google</strong>. 
              Once they log in, their name will permanently appear in the active roster below. You can then use the dropdown selector next to their name to instantly assign them official permissions.
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-white tracking-tight">Active Profiles Registry</h3>
             <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">{users.length} Total Users</span>
          </div>

          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.uid} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between bg-black/20 border border-white/10 rounded-[2rem] backdrop-blur-md transition-all hover:bg-white/5 hover:border-white/20 group shadow-lg">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=48&h=48'} alt={u.fullName} className="h-14 w-14 rounded-full border-2 border-white/10 object-cover group-hover:border-white/30 transition-colors" />
                    {u.role === 'admin' && <div className="absolute -bottom-1 -right-1 bg-fg w-4 h-4 rounded-full border-2 border-background" />}
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-3 text-lg text-white">
                      {u.fullName} 
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${u.role === 'admin' ? 'bg-white text-black border-transparent' : (u.role as any) === 'author' ? 'bg-[#171717]/20 text-[#171717] border-[#171717]/30' : 'bg-white/5 text-white/50 border-white/10'}`}>
                        {u.role === 'user' ? 'No Access' : u.role}
                      </span>
                    </h3>
                    <p className="text-sm font-semibold text-white/40 mt-0.5">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center w-full sm:w-auto relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 text-white/40 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
                  <select 
                    value={u.role} 
                    onChange={(e) => updateUserRoleOrStatus(u.uid, { role: e.target.value as any })}
                    className="h-12 appearance-none rounded-xl border border-white/10 bg-white/5 pl-4 pr-12 font-bold text-sm w-full outline-none cursor-pointer focus:border-[#171717] focus:bg-white/10 transition-all text-white shadow-inner"
                  >
                    <option value="user" className="bg-[#111] text-white">Revoke Permissions (User)</option>
                    <option value="author" className="bg-[#111] text-[#171717]">Grant Author Rights</option>
                    <option value="admin" className="bg-[#111] text-white">Grant Admin Access</option>
                  </select>
                </div>
              </div>
            ))}
            {users.length === 0 && <div className="text-sm font-medium text-white/40 italic p-8 bg-white/5 rounded-[2rem] border border-white/5 text-center shadow-inner">Our security systems show no logged-in profiles yet.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
