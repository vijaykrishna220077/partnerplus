import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Heart, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { TrainingCourse } from '../../data/workerJobData';

interface WorkerWelfareTabProps {
  trainings: TrainingCourse[];
  onToggleTraining: (courseId: string) => void;
}

export const WorkerWelfareTab: React.FC<WorkerWelfareTabProps> = ({
  trainings,
  onToggleTraining
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'welfare' | 'training' | 'documents'>('welfare');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([
    'Aadhaar Card (Identity)',
    'ITI Electrician Trade Certificate',
    'Cooperative Passbook Copy'
  ]);

  return (
    <div className="space-y-6">
      {/* Sub navigation */}
      <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200">
        <button
          onClick={() => setActiveSubTab('welfare')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'welfare' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Heart className="w-4 h-4 text-red-500" />
          <span>My Welfare</span>
        </button>

        <button
          onClick={() => setActiveSubTab('training')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'training' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Learn &amp; Grow</span>
        </button>

        <button
          onClick={() => setActiveSubTab('documents')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'documents' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>My Documents</span>
        </button>
      </div>

      {/* 1. MY WELFARE (Section 29) */}
      {activeSubTab === 'welfare' && (
        <div className="space-y-4">
          {/* Active Insurance Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-100 tracking-wider">
                Government Insurance Scheme
              </span>
              <span className="text-xs font-black bg-white text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ACTIVE</span>
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black">
              ₹2,00,000 PMSBY Accident Coverage
            </div>

            <p className="text-xs text-emerald-100 leading-relaxed">
              Pradhan Mantri Suraksha Bima Yojana (PMSBY) policy #COOP-IN-8891-PMSBY is active and paid annually by your cooperative society with zero personal deductions.
            </p>
          </div>

          {/* Welfare Benefits Checklist */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-base font-black text-gray-900">
              Cooperative Membership Benefits
            </h3>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">Accident & Hospitalization Protection</div>
                  <div className="text-gray-500 mt-0.5">Free emergency medical assistance if injured while performing cooperative service jobs.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">Safety Gear & Tool Support Subsidy</div>
                  <div className="text-gray-500 mt-0.5">Free electrical insulated gloves, heavy duty helmets, and safety boots distributed at society office.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                <Heart className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">Children Education Scholarship</div>
                  <div className="text-gray-500 mt-0.5">Annual educational stipend for children of active daily-wage and skilled cooperative members.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEARN & GROW / TRAINING & SKILL DEVELOPMENT (Section 28) */}
      {activeSubTab === 'training' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900">
                Learn &amp; Grow (Free Training Courses)
              </h3>
              <p className="text-xs text-gray-500">
                Enhance your skills to qualify for higher-earning skilled jobs.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              100% Free
            </span>
          </div>

          <div className="space-y-3">
            {trainings.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                      {course.category}
                    </span>
                    <h4 className="text-base font-black text-gray-900 mt-1">
                      {course.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {course.benefits}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {course.fee}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2 border border-gray-200">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div>Mode: {course.mode}</div>
                </div>

                <button
                  onClick={() => onToggleTraining(course.id)}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                    course.enrolled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  {course.enrolled ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Enrolled • Next Batch: {course.nextBatch}</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>Join Training (Free)</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MY DOCUMENTS (Section 30) */}
      {activeSubTab === 'documents' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Verified Member Documents
                </h3>
                <p className="text-xs text-gray-500">
                  Approved by Cooperative Secretary & Labour Department
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Verified
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2.5 font-bold text-gray-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{doc}</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              ))}
            </div>

            {/* Simple Upload Box */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center space-y-2">
              <Upload className="w-6 h-6 text-gray-400 mx-auto" />
              <div className="text-xs font-bold text-gray-700">
                Upload Additional Skill Certificate or ID
              </div>
              <p className="text-[11px] text-gray-500">
                Take photo from phone camera or select file (Max 5 MB)
              </p>
              <label className="inline-block px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl border border-gray-300 cursor-pointer shadow-2xs">
                Select Photo
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedDocs((prev) => [...prev, e.target.files![0].name + ' (Under Review)']);
                    }
                  }} 
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
