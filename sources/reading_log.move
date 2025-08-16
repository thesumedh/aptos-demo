module reading_log::reading_log {
    use std::signer;
    use std::vector;

    // Errors
    const E_NOT_TEACHER: u64 = 1;
    const E_STUDENT_NOT_FOUND: u64 = 2;

    // Reading entry structure
    struct ReadingEntry has store, copy, drop {
        book_title: vector<u8>,
        pages_read: u64,
        verified: bool,
    }

    // Student reading log
    struct StudentLog has key {
        entries: vector<ReadingEntry>,
        total_pages: u64,
        badges_earned: u64,
        reward_balance: u64,
    }

    // Teacher registry
    struct TeacherRegistry has key {
        teachers: vector<address>,
    }

    // Initialize the module
    fun init_module(admin: &signer) {
        move_to(admin, TeacherRegistry {
            teachers: vector::empty(),
        });
    }

    // Register a teacher
    public entry fun register_teacher(admin: &signer, teacher: address) acquires TeacherRegistry {
        let registry = borrow_global_mut<TeacherRegistry>(signer::address_of(admin));
        vector::push_back(&mut registry.teachers, teacher);
    }

    // Initialize student log
    public entry fun init_student_log(student: &signer) {
        move_to(student, StudentLog {
            entries: vector::empty(),
            total_pages: 0,
            badges_earned: 0,
            reward_balance: 0,
        });
    }

    // Log reading activity
    public entry fun log_reading(
        student: &signer,
        book_title: vector<u8>,
        pages_read: u64,
    ) acquires StudentLog {
        let student_addr = signer::address_of(student);
        
        if (!exists<StudentLog>(student_addr)) {
            init_student_log(student);
        };

        let log = borrow_global_mut<StudentLog>(student_addr);
        let entry = ReadingEntry {
            book_title,
            pages_read,
            verified: false,
        };

        vector::push_back(&mut log.entries, entry);
    }

    // Teacher verifies reading entry and awards rewards
    public entry fun verify_reading(
        teacher: &signer,
        student_addr: address,
        entry_index: u64,
    ) acquires TeacherRegistry, StudentLog {
        let teacher_addr = signer::address_of(teacher);
        let registry = borrow_global<TeacherRegistry>(@reading_log);
        
        assert!(vector::contains(&registry.teachers, &teacher_addr), E_NOT_TEACHER);
        assert!(exists<StudentLog>(student_addr), E_STUDENT_NOT_FOUND);

        let log = borrow_global_mut<StudentLog>(student_addr);
        let entry = vector::borrow_mut(&mut log.entries, entry_index);
        
        if (!entry.verified) {
            entry.verified = true;
            log.total_pages = log.total_pages + entry.pages_read;
            
            // Check for badge eligibility (every 100 pages)
            let new_badge_level = log.total_pages / 100;
            if (new_badge_level > log.badges_earned) {
                let badges_to_award = new_badge_level - log.badges_earned;
                log.badges_earned = new_badge_level;
                
                // Award rewards for new badges (10 APT per badge)
                let reward_amount = badges_to_award * 10;
                log.reward_balance = log.reward_balance + reward_amount;
            };
        };
    }

    // Simplified reward tracking (no actual coin transfers)
    public entry fun claim_rewards(
        student: &signer,
    ) acquires StudentLog {
        let student_addr = signer::address_of(student);
        let log = borrow_global_mut<StudentLog>(student_addr);
        log.reward_balance = 0;
    }

    // View functions
    #[view]
    public fun get_student_stats(student_addr: address): (u64, u64, u64, u64) acquires StudentLog {
        if (!exists<StudentLog>(student_addr)) {
            return (0, 0, 0, 0)
        };
        
        let log = borrow_global<StudentLog>(student_addr);
        (vector::length(&log.entries), log.total_pages, log.badges_earned, log.reward_balance)
    }

    #[view]
    public fun is_teacher(teacher_addr: address): bool acquires TeacherRegistry {
        let registry = borrow_global<TeacherRegistry>(@reading_log);
        vector::contains(&registry.teachers, &teacher_addr)
    }
}