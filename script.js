// Academic Subjects List
const SUBJECTS = [
  { id: 'ppca', name: 'PPCA (Parallel Computing & Architecture)' },
  { id: 'coos', name: 'COOS (Computer Organization & OS)' },
  { id: 'dsa', name: 'DSA (Data Structures & Algorithms)' },
  { id: 'maths', name: 'Mathematics (Applied Mathematics)' }
];

// Seed Data for AI&ML A TCET Students
const DEFAULT_STUDENTS = [
  {
    id: 's1',
    roll: 'AIML-24-01',
    name: 'Abhinav Dubey',
    initials: 'AD',
    records: {
      ppca: { attended: 18, total: 20 },
      coos: { attended: 16, total: 20 },
      dsa: { attended: 19, total: 20 },
      maths: { attended: 17, total: 20 }
    }
  },
  {
    id: 's2',
    roll: 'AIML-24-02',
    name: 'Krish Dubey',
    initials: 'KD',
    records: {
      ppca: { attended: 13, total: 20 },
      coos: { attended: 14, total: 20 },
      dsa: { attended: 12, total: 20 },
      maths: { attended: 11, total: 20 }
    }
  },
  {
    id: 's3',
    roll: 'AIML-24-03',
    name: 'Anshuman Dubey',
    initials: 'AnD',
    records: {
      ppca: { attended: 17, total: 20 },
      coos: { attended: 18, total: 20 },
      dsa: { attended: 16, total: 20 },
      maths: { attended: 15, total: 20 }
    }
  }
];

// Initialize State from LocalStorage or Defaults
let students = JSON.parse(localStorage.getItem('adtg_students')) || DEFAULT_STUDENTS;
let tempStatus = { s1: 'present', s2: 'present', s3: 'present' };

// Persist updates
function persistState() {
  localStorage.setItem('adtg_students', JSON.stringify(students));
}

// Switch between Faculty Portal and Student View
function switchRole(role) {
  const teacherView = document.getElementById('view-teacher');
  const studentView = document.getElementById('view-student');
  const teacherBtn = document.getElementById('nav-teacher-btn');
  const studentBtn = document.getElementById('nav-student-btn');

  if (role === 'teacher') {
    teacherView.classList.remove('hidden');
    studentView.classList.add('hidden');
    teacherBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-indigo-600 text-white shadow-sm";
    studentBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-400 hover:text-white";
    renderTeacherRoster();
  } else {
    teacherView.classList.add('hidden');
    studentView.classList.remove('hidden');
    studentBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-indigo-600 text-white shadow-sm";
    teacherBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-400 hover:text-white";
    renderStudentPortal();
  }
  lucide.createIcons();
}

// Compute aggregate attendance across all subjects
function calculateStudentOverall(student) {
  let totalAtt = 0, totalClasses = 0;
  Object.values(student.records).forEach(sub => {
    totalAtt += sub.attended;
    totalClasses += sub.total;
  });
  const pct = totalClasses === 0 ? 0 : Math.round((totalAtt / totalClasses) * 100);
  return { totalAtt, totalClasses, pct };
}

// Render Teacher Roster UI
function renderTeacherRoster() {
  const subKey = document.getElementById('session-subject').value;
  const tbody = document.getElementById('teacher-roster-body');
  tbody.innerHTML = '';

  students.forEach(student => {
    const subData = student.records[subKey];
    const subPct = subData.total === 0 ? 0 : Math.round((subData.attended / subData.total) * 100);
    const current = tempStatus[student.id];

    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-900/40 transition-colors";
    tr.innerHTML = `
      <td class="p-4 font-mono font-semibold text-slate-400">${student.roll}</td>
      <td class="p-4 font-bold text-white flex items-center gap-2.5">
        <div class="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
          ${student.initials}
        </div>
        ${student.name}
      </td>
      <td class="p-4 text-slate-400">AI&amp;ML - TCET</td>
      <td class="p-4 text-center">
        <span class="px-2 py-0.5 rounded text-xs font-semibold ${subPct >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">
          ${subPct}% (${subData.attended}/${subData.total})
        </span>
      </td>
      <td class="p-4 text-right">
        <div class="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 gap-0.5">
          <button onclick="setStatus('${student.id}', 'present')" class="px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${current === 'present' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}">
            Present
          </button>
          <button onclick="setStatus('${student.id}', 'absent')" class="px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${current === 'absent' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}">
            Absent
          </button>
          <button onclick="setStatus('${student.id}', 'late')" class="px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${current === 'late' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}">
            Late
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  lucide.createIcons();
}

function setStatus(studentId, status) {
  tempStatus[studentId] = status;
  renderTeacherRoster();
}

function setAllStatus(status) {
  students.forEach(s => tempStatus[s.id] = status);
  renderTeacherRoster();
}

function saveAttendanceSession() {
  const subKey = document.getElementById('session-subject').value;
  const date = document.getElementById('session-date').value || new Date().toISOString().split('T')[0];

  students.forEach(student => {
    student.records[subKey].total += 1;
    if (tempStatus[student.id] === 'present' || tempStatus[student.id] === 'late') {
      student.records[subKey].attended += 1;
    }
  });

  persistState();
  renderTeacherRoster();
  alert(`Attendance recorded successfully for ${subKey.toUpperCase()} on ${date} by Prof. Prateek Dave!`);
}

// Render Student Portal UI
function renderStudentPortal() {
  const studentId = document.getElementById('student-selector').value;
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  document.getElementById('student-display-name').textContent = student.name;
  document.getElementById('student-display-roll').textContent = student.roll;
  document.getElementById('student-avatar-initials').textContent = student.initials;

  const overall = calculateStudentOverall(student);
  document.getElementById('student-agg-percent').textContent = `${overall.pct}%`;
  document.getElementById('gauge-center-text').textContent = `${overall.pct}%`;
  document.getElementById('student-total-attended').textContent = `${overall.totalAtt} / ${overall.totalClasses}`;

  const gaugePath = document.getElementById('svg-gauge-path');
  const offset = 100 - overall.pct;
  gaugePath.style.strokeDashoffset = offset;

  const eligibilityBadge = document.getElementById('eligibility-status-badge');
  const eligibilityDesc = document.getElementById('eligibility-description');
  const subText = document.getElementById('student-agg-status-sub');

  if (overall.pct >= 75) {
    gaugePath.classList.remove('text-rose-500');
    gaugePath.classList.add('text-emerald-400');
    subText.textContent = "Safe: Above 75% institutional quota";
    subText.className = "text-[11px] mt-1 font-medium text-emerald-400";
    eligibilityBadge.textContent = "Eligible for Term End Exams";
    eligibilityBadge.className = "text-lg font-bold text-emerald-400 mt-2";
    eligibilityDesc.textContent = "Attendance satisfies TCET exam eligibility guidelines.";
  } else {
    gaugePath.classList.remove('text-emerald-400');
    gaugePath.classList.add('text-rose-500');
    subText.textContent = "Warning: Attendance defaulter risk";
    subText.className = "text-[11px] mt-1 font-medium text-rose-400";
    eligibilityBadge.textContent = "At Risk (Defaulter List)";
    eligibilityBadge.className = "text-lg font-bold text-rose-400 mt-2";
    eligibilityDesc.textContent = "Immediate attendance makeup required before semester freeze.";
  }

  // Render subject-wise deficit calculation
  const tbody = document.getElementById('student-subjects-body');
  tbody.innerHTML = '';

  SUBJECTS.forEach(sub => {
    const data = student.records[sub.id];
    const pct = data.total === 0 ? 0 : Math.round((data.attended / data.total) * 100);

    let adviceHtml = '';
    if (pct >= 75) {
      const safeMiss = Math.floor((data.attended - 0.75 * data.total) / 0.75);
      adviceHtml = `<span class="text-emerald-400 font-semibold">Can safely miss ${safeMiss > 0 ? safeMiss : 0} lecture(s)</span>`;
    } else {
      const needToAttend = Math.max(0, 3 * data.total - 4 * data.attended);
      adviceHtml = `<span class="text-rose-400 font-semibold">Must attend next ${needToAttend} lecture(s) consecutively</span>`;
    }

    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-900/40 transition-colors";
    tr.innerHTML = `
      <td class="p-4 font-bold text-white">${sub.name}</td>
      <td class="p-4 text-slate-300 font-mono">${data.attended} / ${data.total}</td>
      <td class="p-4">
        <span class="px-2 py-0.5 rounded text-xs font-semibold ${pct >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">
          ${pct}%
        </span>
      </td>
      <td class="p-4">${adviceHtml}</td>
    `;
    tbody.appendChild(tr);
  });
  lucide.createIcons();
}

// Set Today's Date by Default & Initialize UI
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('session-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  renderTeacherRoster();
  lucide.createIcons();
});