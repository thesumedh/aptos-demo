// Simulated wallet and contract
const CONTRACT_ADDRESS = "0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0";
const MODULE_NAME = "reading_log";

// Simulated accounts
const ACCOUNTS = {
    student1: { address: "0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0", role: "student", balance: 1000 },
    student2: { address: "0xstudent2", role: "student", balance: 1000 },
    teacher1: { address: "0xteacher1", role: "teacher", balance: 5000 },
    admin: { address: "0xadmin", role: "admin", balance: 10000 }
};

// Simulated blockchain state
let blockchainState = {
    students: {},
    teachers: ["0xteacher1"],
    rewardPool: 1000,
    transactions: []
};

let currentAccount = null;

// Simulate wallet connection
document.getElementById('connectWallet').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-card); padding: 30px; border-radius: 20px;
            border: 1px solid var(--border); min-width: 400px;
        ">
            <h3 style="margin-bottom: 20px; color: var(--text-primary);">🔗 Connect Wallet</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="connectAs('student1')" style="padding: 16px; text-align: left;">
                    👨🎓 Your Wallet<br><small style="opacity: 0.7;">0xb630...1de0</small>
                </button>
                <button onclick="connectAs('student2')" style="padding: 16px; text-align: left;">
                    👩🎓 Student 2<br><small style="opacity: 0.7;">0xstudent2</small>
                </button>
                <button onclick="connectAs('teacher1')" style="padding: 16px; text-align: left;">
                    👩🏫 Teacher 1<br><small style="opacity: 0.7;">0xteacher1</small>
                </button>
                <button onclick="connectAs('admin')" style="padding: 16px; text-align: left;">
                    ⚙️ Admin<br><small style="opacity: 0.7;">0xadmin</small>
                </button>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="margin-top: 16px; width: 100%; background: var(--bg-secondary);">
                ❌ Cancel
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    window.connectAs = (accountKey) => {
        currentAccount = ACCOUNTS[accountKey];
        document.getElementById('walletAddress').textContent = 
            currentAccount.address.slice(0, 6) + "..." + currentAccount.address.slice(-4);
        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('connectWallet').textContent = "🔗 Connected";
        showStatus(`✅ Connected as ${accountKey}`, "success");
        loadStudentStats();
        updateRecentActivity();
        updateTransactionHistory();
        modal.remove();
    };
});

// Tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.remove('hidden');
    event.target.classList.add('active');
}

// Student functions
function logReading() {
    if (!currentAccount) {
        showStatus("Please connect wallet first", "error");
        return;
    }

    const bookTitle = document.getElementById('bookTitle').value;
    const pagesRead = document.getElementById('pagesRead').value;

    if (!bookTitle || !pagesRead) {
        showStatus("Please fill all fields", "error");
        return;
    }

    // Simulate transaction
    const studentAddr = currentAccount.address;
    if (!blockchainState.students[studentAddr]) {
        blockchainState.students[studentAddr] = {
            entries: [],
            totalPages: 0,
            badges: 0,
            rewards: 0
        };
    }

    const entry = {
        bookTitle,
        pagesRead: parseInt(pagesRead),
        verified: false,
        timestamp: Date.now()
    };

    blockchainState.students[studentAddr].entries.push(entry);
    
    const txHash = "0x" + Math.random().toString(16).substr(2, 8);
    blockchainState.transactions.push({
        hash: txHash,
        type: "log_reading",
        from: studentAddr,
        data: entry
    });

    showStatus(`📚 Reading logged! Hash: ${txHash}`, "success");
    
    // Clear form
    document.getElementById('bookTitle').value = '';
    document.getElementById('pagesRead').value = '';
    
    loadStudentStats();
    updateRecentActivity();
    updateTransactionHistory();
}

function loadStudentStats() {
    if (!currentAccount) return;

    const studentData = blockchainState.students[currentAccount.address];
    if (studentData) {
        animateCounter('#studentStats .stat:nth-child(1) h3', studentData.entries.length);
        animateCounter('#studentStats .stat:nth-child(2) h3', studentData.totalPages);
        animateCounter('#studentStats .stat:nth-child(3) h3', studentData.badges);
        document.querySelector('#studentStats .stat:nth-child(4) h3').textContent = studentData.rewards + " APT";
    } else {
        document.querySelector('#studentStats .stat:nth-child(1) h3').textContent = "0";
        document.querySelector('#studentStats .stat:nth-child(2) h3').textContent = "0";
        document.querySelector('#studentStats .stat:nth-child(3) h3').textContent = "0";
        document.querySelector('#studentStats .stat:nth-child(4) h3').textContent = "0 APT";
    }
}

function animateCounter(selector, target) {
    const element = document.querySelector(selector);
    const start = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (target - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Teacher functions
function verifyReading() {
    if (!currentAccount || currentAccount.role !== 'teacher') {
        showStatus("Only teachers can verify reading", "error");
        return;
    }

    const studentAddress = document.getElementById('studentAddress').value;
    const entryIndex = document.getElementById('entryIndex').value;

    if (!studentAddress || entryIndex === '') {
        showStatus("Please fill all fields", "error");
        return;
    }

    const studentData = blockchainState.students[studentAddress];
    if (!studentData || !studentData.entries[entryIndex]) {
        showStatus("Student or entry not found", "error");
        return;
    }

    const entry = studentData.entries[entryIndex];
    if (!entry.verified) {
        entry.verified = true;
        const oldPages = studentData.totalPages;
        studentData.totalPages += entry.pagesRead;
        
        // Check for new badges (every 100 pages)
        const newBadges = Math.floor(studentData.totalPages / 100);
        const badgesEarned = newBadges - studentData.badges;
        
        if (badgesEarned > 0) {
            studentData.badges = newBadges;
            studentData.rewards += badgesEarned * 10; // 10 APT per badge
            showStatus(`🎉 Verified! Student earned ${badgesEarned} badge(s) and ${badgesEarned * 10} APT!`, "success");
        } else {
            showStatus("✅ Reading verified successfully!", "success");
        }
        
        const txHash = "0x" + Math.random().toString(16).substr(2, 8);
        blockchainState.transactions.push({
            hash: txHash,
            type: "verify_reading",
            from: currentAccount.address,
            student: studentAddress,
            entry: entryIndex
        });
    } else {
        showStatus("Entry already verified", "error");
    }
    
    // Clear form
    document.getElementById('studentAddress').value = '';
    document.getElementById('entryIndex').value = '';
    updateTransactionHistory();
}

function checkStudentStats() {
    const studentAddress = document.getElementById('checkStudentAddress').value;
    
    if (!studentAddress) {
        showStatus("Please enter student address", "error");
        return;
    }

    const studentData = blockchainState.students[studentAddress];
    if (studentData) {
        document.getElementById('checkResults').innerHTML = `
            <strong>Student Stats:</strong><br>
            Books Logged: ${studentData.entries.length}<br>
            Pages Verified: ${studentData.totalPages}<br>
            Badges Earned: ${studentData.badges}<br>
            Reward Balance: ${studentData.rewards} APT<br><br>
            <strong>Recent Entries:</strong><br>
            ${studentData.entries.slice(-3).map((entry, i) => 
                `${i}: "${entry.bookTitle}" - ${entry.pagesRead} pages ${entry.verified ? '✓' : '⏳'}`
            ).join('<br>')}
        `;
    } else {
        document.getElementById('checkResults').innerHTML = `
            <strong>Student Stats:</strong><br>
            No reading log found for this address.
        `;
    }
}

// Admin functions
function registerTeacher() {
    if (!currentAccount || currentAccount.role !== 'admin') {
        showStatus("Only admin can register teachers", "error");
        return;
    }

    const teacherAddress = document.getElementById('teacherAddress').value;
    
    if (!teacherAddress) {
        showStatus("Please enter teacher address", "error");
        return;
    }

    if (!blockchainState.teachers.includes(teacherAddress)) {
        blockchainState.teachers.push(teacherAddress);
        
        const txHash = "0x" + Math.random().toString(16).substr(2, 8);
        blockchainState.transactions.push({
            hash: txHash,
            type: "register_teacher",
            from: currentAccount.address,
            teacher: teacherAddress
        });
        
        showStatus(`Teacher registered! Hash: ${txHash}`, "success");
    } else {
        showStatus("Teacher already registered", "error");
    }
    
    document.getElementById('teacherAddress').value = '';
}

function checkTeacher() {
    const teacherAddress = document.getElementById('checkTeacherAddress').value;
    
    if (!teacherAddress) {
        showStatus("Please enter teacher address", "error");
        return;
    }

    const isTeacher = blockchainState.teachers.includes(teacherAddress);
    
    document.getElementById('teacherResults').innerHTML = `
        <strong>Teacher Status:</strong><br>
        ${teacherAddress} is ${isTeacher ? '' : 'NOT '}a registered teacher<br><br>
        <strong>All Registered Teachers:</strong><br>
        ${blockchainState.teachers.join('<br>')}
    `;
}

// Add claim rewards function
function claimRewards() {
    if (!currentAccount) {
        showStatus("Please connect wallet first", "error");
        return;
    }

    const studentData = blockchainState.students[currentAccount.address];
    if (studentData && studentData.rewards > 0) {
        const amount = studentData.rewards;
        studentData.rewards = 0;
        currentAccount.balance += amount;
        
        const txHash = "0x" + Math.random().toString(16).substr(2, 8);
        showStatus(`💰 Claimed ${amount} APT! Hash: ${txHash}`, "success");
        loadStudentStats();
    } else {
        showStatus("No rewards to claim", "error");
    }
}

// Utility functions
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = type;
    
    setTimeout(() => {
        status.textContent = '';
        status.className = '';
    }, 5000);
}

// Enhanced UI functions
function updateRecentActivity() {
    if (!currentAccount) return;
    
    const studentData = blockchainState.students[currentAccount.address];
    const activityDiv = document.getElementById('recentActivity');
    
    if (studentData && studentData.entries.length > 0) {
        activityDiv.innerHTML = studentData.entries.slice(-5).reverse().map((entry, i) => `
            <div style="padding: 12px; margin: 8px 0; background: var(--bg-secondary); border-radius: 8px; border-left: 4px solid ${entry.verified ? 'var(--success)' : 'var(--warning)'}">
                <strong>"${entry.bookTitle}"</strong> - ${entry.pagesRead} pages
                <span style="float: right;">${entry.verified ? '✅ Verified' : '⏳ Pending'}</span>
            </div>
        `).join('');
    } else {
        activityDiv.innerHTML = '<p style="color: var(--text-secondary);">📚 No reading entries yet. Start logging your books!</p>';
    }
}

function updateTransactionHistory() {
    const historyDiv = document.getElementById('transactionHistory');
    const recentTxs = blockchainState.transactions.slice(-10).reverse();
    
    if (recentTxs.length > 0) {
        historyDiv.innerHTML = recentTxs.map(tx => `
            <div class="transaction-item">
                <span class="hash">${tx.hash}</span> - ${tx.type.replace('_', ' ')}
                <small style="float: right; opacity: 0.7;">${new Date(tx.timestamp || Date.now()).toLocaleTimeString()}</small>
            </div>
        `).join('');
    } else {
        historyDiv.innerHTML = '<p style="color: var(--text-secondary);">🔗 No transactions yet...</p>';
    }
}

function showClassStats() {
    const results = document.getElementById('classResults');
    const students = Object.keys(blockchainState.students);
    
    if (students.length > 0) {
        results.innerHTML = `
            <h4>📊 Class Statistics</h4>
            ${students.map(addr => {
                const data = blockchainState.students[addr];
                return `
                    <div style="padding: 16px; margin: 8px 0; background: var(--bg-secondary); border-radius: 8px;">
                        <strong>${addr.slice(0, 8)}...${addr.slice(-6)}</strong><br>
                        📚 ${data.entries.length} books | 📄 ${data.totalPages} pages | 🏆 ${data.badges} badges | 💰 ${data.rewards} APT
                    </div>
                `;
            }).join('')}
        `;
    } else {
        results.innerHTML = '<p>👥 No students registered yet.</p>';
    }
}

function fundPool() {
    if (!currentAccount || currentAccount.role !== 'admin') {
        showStatus("❌ Only admin can fund the pool", "error");
        return;
    }
    
    const amount = parseInt(document.getElementById('fundAmount').value);
    if (!amount) {
        showStatus("❌ Please enter amount", "error");
        return;
    }
    
    blockchainState.rewardPool += amount;
    showStatus(`💰 Added ${amount} APT to reward pool!`, "success");
    document.getElementById('fundAmount').value = '';
    
    document.querySelector('#poolStatus').innerHTML = `
        <p>Current Pool: <span class="badge">${blockchainState.rewardPool} APT</span></p>
        <p>Reward per Badge: <span class="badge">10 APT</span></p>
    `;
}

function showSystemStats() {
    const results = document.getElementById('systemStats');
    const totalStudents = Object.keys(blockchainState.students).length;
    const totalBooks = Object.values(blockchainState.students).reduce((sum, s) => sum + s.entries.length, 0);
    const totalPages = Object.values(blockchainState.students).reduce((sum, s) => sum + s.totalPages, 0);
    const totalBadges = Object.values(blockchainState.students).reduce((sum, s) => sum + s.badges, 0);
    
    results.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px;">
            <div class="stat"><h3>${totalStudents}</h3><p>Total Students</p></div>
            <div class="stat"><h3>${totalBooks}</h3><p>Books Logged</p></div>
            <div class="stat"><h3>${totalPages}</h3><p>Pages Read</p></div>
            <div class="stat"><h3>${totalBadges}</h3><p>Badges Earned</p></div>
        </div>
    `;
}

// Initialize simulated data
window.addEventListener('load', () => {
    // Add demo data
    blockchainState.students["0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0"] = {
        entries: [
            { bookTitle: "Harry Potter", pagesRead: 150, verified: true, timestamp: Date.now() - 86400000 },
            { bookTitle: "The Hobbit", pagesRead: 80, verified: false, timestamp: Date.now() - 3600000 }
        ],
        totalPages: 150,
        badges: 1,
        rewards: 10
    };
    
    blockchainState.transactions = [
        { hash: "0xabc123", type: "log_reading", timestamp: Date.now() - 86400000 },
        { hash: "0xdef456", type: "verify_reading", timestamp: Date.now() - 3600000 }
    ];
    
    updateTransactionHistory();
});