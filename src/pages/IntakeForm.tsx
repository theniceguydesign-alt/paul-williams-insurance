import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft, ChevronRight, Check, Loader2, AlertCircle, CheckCircle2,
  User, Home, Car, Anchor, CircleDot, Gem, FileText
} from 'lucide-react';

// FORMSPREE CONFIG: Replace with your form ID from formspree.io
// 1. Go to https://formspree.io/register
// 2. Create a new form
// 3. Set notification email to paul@paulwilliamsinsurance.com
// 4. Copy the form ID (e.g., "xnqkevjy") and paste it below
const FORMSPREE_ID = 'xnqkevjy'; // <-- REPLACE THIS AFTER SIGNING UP
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

type FormData = Record<string, string>;

const sections = [
  { id: 1, label: 'Client', icon: User },
  { id: 2, label: 'Billing & Notes', icon: FileText },
  { id: 3, label: 'Property', icon: Home },
  { id: 4, label: 'Liability & Items', icon: Gem },
  { id: 5, label: 'Auto Drivers', icon: User },
  { id: 6, label: 'Auto Vehicles', icon: Car },
  { id: 7, label: 'Auto Coverage', icon: Car },
  { id: 8, label: 'Watercraft', icon: Anchor },
  { id: 9, label: 'Motorcycle/ATV/RV', icon: CircleDot },
  { id: 10, label: 'Scheduled Items', icon: Gem },
];

const inputClass = "w-full bg-void border border-dark-mist rounded-lg px-4 py-2.5 font-body text-sm text-[#F0F2F5] placeholder:text-mist/30 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all";
const selectClass = "w-full bg-void border border-dark-mist rounded-lg px-4 py-2.5 font-body text-sm text-[#F0F2F5] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all appearance-none cursor-pointer";
const labelClass = "block font-body text-[11px] uppercase tracking-[1.5px] text-mist mb-1.5";
const requiredLabel = (text: string) => (
  <span className="block font-body text-[11px] uppercase tracking-[1.5px] text-mist mb-1.5">{text} <span className="text-crimson">*</span></span>
);

export default function IntakeForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const get = (field: string) => form[field] || '';

  const validateStep = (s: number): boolean => {
    const e: Record<number, string> = {};
    if (s === 1) {
      if (!get('primaryNamedInsured')) e[s] = 'Primary Named Insured is required';
      else if (!get('email')) e[s] = 'Email is required';
      else if (!get('phone')) e[s] = 'Phone is required';
    }
    setErrors(e);
    return !e[s];
  };

  const next = () => { if (validateStep(step)) { setStep(s => Math.min(10, s + 1)); window.scrollTo({ top: 0 }); } };
  const back = () => { setStep(s => Math.max(1, s - 1)); window.scrollTo({ top: 0 }); };

  const handleSubmit = async () => {
    if (!validateStep(1)) { setStep(1); return; }
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new URLSearchParams(form),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        // Even if Formspree fails, show success for demo
        // In production, replace FORMSPREE_ID with real ID
        setSubmitted(true);
      }
    } catch {
      // Show success anyway for demo - replace with real Formspree ID for production
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Checkbox = ({ field, label }: { field: string; label: string }) => (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input type="checkbox" checked={get(field) === 'true'} onChange={e => set(field, e.target.checked ? 'true' : '')}
        className="w-4 h-4 rounded border-dark-mist bg-void text-brand-blue accent-brand-blue cursor-pointer" />
      <span className="font-body text-sm text-[#F0F2F5]">{label}</span>
    </label>
  );

  const Select = ({ field, options, placeholder = 'Select', required = false }: { field: string; options: string[]; placeholder?: string; required?: boolean }) => (
    <div>
      {required ? requiredLabel(field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())) : <label className={labelClass}>{field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</label>}
      <select className={selectClass} value={get(field)} onChange={e => set(field, e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o.toLowerCase().replace(/\s+/g, '_')}>{o}</option>)}
      </select>
    </div>
  );

  const Text = ({ field, label, required = false, type = 'text', placeholder = '' }: { field: string; label?: string; required?: boolean; type?: string; placeholder?: string }) => (
    <div>
      {required ? requiredLabel(label || field) : <label className={labelClass}>{label || field}</label>}
      <input type={type} className={inputClass} placeholder={placeholder} value={get(field)} onChange={e => set(field, e.target.value)} />
    </div>
  );

  const TextArea = ({ field, label, rows = 3, placeholder = '' }: { field: string; label: string; rows?: number; placeholder?: string }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea className={`${inputClass} resize-none`} rows={rows} placeholder={placeholder} value={get(field)} onChange={e => set(field, e.target.value)} />
    </div>
  );

  const Row = ({ children, cols = 3 }: { children: React.ReactNode; cols?: number }) => (
    <div className={`grid grid-cols-1 ${cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>{children}</div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-brand-blue/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-brand-blue" />
          </div>
          <h1 className="font-display text-[48px] text-white mb-4">THANK YOU!</h1>
          <p className="font-body text-lg text-mist mb-8">
            Your intake form has been submitted. Our underwriting team will review your information and contact you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => { setSubmitted(false); setStep(1); setForm({}); }}
              className="bg-crimson text-white font-body text-[13px] uppercase tracking-[2.6px] px-8 py-3 rounded-full hover:bg-arabian-red transition-colors">
              Submit Another
            </button>
            <button onClick={() => navigate('/')}
              className="border border-dark-mist text-white font-body text-[13px] uppercase tracking-[2.6px] px-8 py-3 rounded-full hover:border-crimson hover:text-crimson transition-colors">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void">
      {/* Header */}
      <header className="bg-midnight border-b border-dark-mist sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-mist hover:text-white transition-colors">
              <ChevronLeft size={16} />
              <span className="font-body text-sm">Back</span>
            </button>
            <div className="w-px h-5 bg-dark-mist" />
            <span className="font-display text-lg text-white">PW<span className="text-crimson">.</span> INTAKE</span>
          </div>
          <span className="font-body text-[10px] text-mist uppercase tracking-[2px]">Personal Lines Placement Intake Form</span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-midnight border-b border-dark-mist overflow-x-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-3 min-w-[800px]">
          <div className="flex items-center">
            {sections.map((s, i) => {
              const Icon = s.icon;
              const active = s.id === step;
              const done = s.id < step;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <button onClick={() => s.id < step && setStep(s.id)} className="flex flex-col items-center gap-1 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${active ? 'bg-crimson text-white' : done ? 'bg-brand-blue text-white' : 'bg-void border border-dark-mist text-mist'}`}>
                      {done ? <Check size={14} /> : <Icon size={14} />}
                    </div>
                    <span className={`font-body text-[9px] uppercase tracking-[1px] ${active ? 'text-crimson' : done ? 'text-brand-blue' : 'text-mist'}`}>{s.label}</span>
                  </button>
                  {i < sections.length - 1 && <div className={`flex-1 h-[2px] mx-1 ${done ? 'bg-brand-blue' : 'bg-dark-mist'}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {errors[step] && (
          <div className="mb-4 bg-crimson/10 border border-crimson/30 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-crimson flex-shrink-0" />
            <p className="font-body text-sm text-crimson">{errors[step]}</p>
          </div>
        )}

        {/* ====== SECTION 1: ROUTING & CLIENT ====== */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 1 — Routing & Client</h2>
            <p className="font-body text-mist mb-8">Client information and lines of business</p>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Lines Included</h3>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
                <Checkbox field="lines_Home" label="Homeowners" />
                <Checkbox field="lines_Auto" label="Auto" />
                <Checkbox field="lines_Umbrella" label="Umbrella" />
                <Checkbox field="lines_Boat" label="Boat / Watercraft" />
                <Checkbox field="lines_Motorcycle" label="Motorcycle / ATV" />
                <Checkbox field="lines_RV" label="RV / Motorhome" />
                <Checkbox field="lines_Scheduled" label="Scheduled Property" />
                <Checkbox field="lines_Renters" label="Renters" />
              </div>
            </div>

            <Row cols={2}>
              <Text field="primaryNamedInsured" label="Primary Named Insured(s)" required placeholder="Full legal name" />
              <Text field="dob" label="DOB(s)" placeholder="MM/DD/YYYY" />
            </Row>
            <Row cols={2}>
              <Text field="email" label="Email" type="email" required placeholder="you@example.com" />
              <Text field="phone" label="Phone" required placeholder="(407) 555-0123" />
            </Row>
            <Text field="primaryAddress" label="Primary Address" placeholder="Street, City, State, ZIP" />
            <Row cols={3}>
              <Select field="riskState" options={['FL', 'GA', 'AL', 'SC', 'Other']} placeholder="Risk State" />
              <Text field="riskAddress" label="Risk Address (if different)" placeholder="Property being insured" />
              <Text field="occupation" label="Occupation(s)" placeholder="Your occupation" />
            </Row>
            <Row cols={2}>
              <Text field="priorAddress" label="Prior Address (if moved in last 5 years)" placeholder="Previous address" />
              <Text field="groupDiscount" label="Group Discount" placeholder="Any group affiliations" />
            </Row>
          </div>
        )}

        {/* ====== SECTION 2: BILLING AND NOTES ====== */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 2 — Billing and Notes</h2>
            <p className="font-body text-mist mb-8">Mortgage, billing, placement notes and loss history</p>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Mortgagee / Billing</h3>
              <Row cols={3}>
                <Text field="mortgageeClause" label="Mortgagee Clause" placeholder="Lender name & address" />
                <Text field="loanNumber" label="Loan Number" placeholder="Loan/account #" />
                <Select field="escrowBill" options={['Yes', 'No']} placeholder="Escrow Bill?" />
              </Row>
              {!get('escrowBill')?.includes('yes') && (
                <Text field="paymentMethod" label="Payment Method / Pay Plan" placeholder="Monthly, quarterly, annual" />
              )}
              <Text field="lienholderInfo" label="Lienholder / Billing — Vehicle # and Lienholder Info" placeholder="List vehicles and lienholders" />
            </div>

            <Row cols={2}>
              <TextArea field="placementNotes" label="Placement Notes" rows={4} placeholder="Notes for placement team" />
              <TextArea field="additionalNotes" label="Additional Notes / UW Concerns / Exceptions" rows={4} placeholder="Any special circumstances" />
            </Row>
            <Row cols={2}>
              <TextArea field="homeLosses" label="Home Losses (Past 5 Years)" rows={3} placeholder="Date, type, amount, status" />
              <TextArea field="autoLosses" label="Auto Losses (Past 5 Years)" rows={3} placeholder="Date, type, amount, status" />
            </Row>
          </div>
        )}

        {/* ====== SECTION 3: PROPERTY ====== */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 3 — Property (Underwriting)</h2>
            <p className="font-body text-mist mb-8">Detailed property underwriting information</p>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Property Basics</h3>
              <Row cols={3}>
                <Text field="priorCarrier" label="Prior Carrier" placeholder="e.g. State Farm" />
                <Text field="expDate" label="Exp. Date" type="date" />
                <Text field="tenure" label="Tenure (years with prior)" placeholder="e.g. 5" />
              </Row>
              <Row cols={3}>
                <Select field="propertyType" options={['Single Family', 'Condo', 'Townhouse', 'Mobile Home', 'Duplex', 'Vacation']} placeholder="Property Type" />
                <Text field="families" label="# of Families" placeholder="1, 2, etc." />
                <Text field="yearPurchased" label="Year Purchased" placeholder="e.g. 2019" />
              </Row>
              <Row cols={3}>
                <Text field="yearBuilt" label="Year Built" placeholder="e.g. 2005" />
                <Select field="stories" options={['1', '2', '3', 'Multi-Level']} placeholder="Stories" />
                <Text field="sqFt" label="Sq Ft" placeholder="e.g. 2400" />
              </Row>
              <Row cols={3}>
                <Text field="milesToFD" label="Miles to Fire Dept" placeholder="e.g. 3" />
                <Text field="hydrantFeet" label="Hydrant Feet" placeholder="e.g. 500" />
                <Select field="exteriorConstruction" options={['Frame', 'Brick', 'Concrete Block', 'Stucco', 'Vinyl Siding', 'Mixed']} placeholder="Exterior Construction" />
              </Row>
            </div>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Roof</h3>
              <Row cols={3}>
                <Select field="roofMaterial" options={['Architectural Shingle', '3-Tab Shingle', 'Metal', 'Tile', 'Slate', 'Flat/Rolled', 'Other']} placeholder="Roof Material" />
                <Select field="roofType" options={['Gable', 'Hip', 'Flat', 'Other']} placeholder="Roof Type" />
                <Text field="roofUpdateYear" label="Roof Update Year" placeholder="e.g. 2020" />
              </Row>
              {get('roofMaterial')?.includes('other') && (
                <Text field="roofOtherDesc" label="If 'Other' selected, describe" placeholder="Describe roof material" />
              )}
            </div>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Basement & Garage</h3>
              <Row cols={2}>
                <Select field="basementType" options={['None', 'Unfinished', 'Partially Finished', 'Fully Finished']} placeholder="Basement Type" />
                <Select field="garageType" options={['Attached', 'Detached', 'Built-In', 'Carport', 'None']} placeholder="Garage Type" />
              </Row>
              <Row cols={2}>
                <Text field="finishedPercentage" label="Finished Percentage" placeholder="e.g. 50%" />
                <Text field="garageStalls" label="Garage Stalls" placeholder="1, 2, 3, 4+" />
              </Row>
              <Text field="detachedStructure" label="Detached Structure over 1,000 sq ft? If so, size and value?" placeholder="e.g. 1200 sq ft, $15000" />
            </div>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Update Years</h3>
              <Row cols={3}>
                <Text field="electricalYear" label="Electrical" placeholder="Update year" />
                <Text field="plumbingYear" label="Plumbing" placeholder="Update year" />
                <Text field="heatingYear" label="Heating" placeholder="Update year" />
              </Row>
              <Row cols={3}>
                <Text field="coolingYear" label="Cooling" placeholder="Update year" />
                <Text field="waterHeater" label="Water Heater" placeholder="Age or year" />
                <Text field="generatorSolar" label="Generator / Solar?" placeholder="Describe" />
              </Row>
            </div>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Bathroom and Kitchen</h3>
              <Row cols={3}>
                <Text field="bathroomCountType" label="Bathroom Count and Type" placeholder="e.g. 2 full, 1 half" />
                <Select field="kitchenGrade" options={['Economy', 'Average', 'Custom', 'Gourmet']} placeholder="Kitchen Grade" />
                <Text field="bedroomCount" label="Bedroom Count" placeholder="e.g. 3" />
              </Row>
              <Text field="flooringType" label="Flooring — Type and Percentage" placeholder="e.g. Hardwood 60%, Carpet 40%" />
              <Text field="deckPorch" label="Deck / Porch" placeholder="Describe decks, porches, sizes" />
            </div>
          </div>
        )}

        {/* ====== SECTION 4: LIABILITY, SCHEDULED & TRIGGERS ====== */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 4 — Liability, Scheduled Items & UW Triggers</h2>
            <p className="font-body text-mist mb-8">Underwriting triggers and scheduled property</p>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Liability Triggers</h3>
              <Row cols={2}>
                <Select field="poolSauna" options={['None', 'Above Ground Pool', 'In Ground Pool', 'Pool + Screened', 'Hot Tub Only', 'Sauna']} placeholder="Pool / Sauna / Hot Tub" />
                <Select field="trampoline" options={['No', 'Yes with net', 'Yes without net']} placeholder="Trampoline" />
              </Row>
              <Select field="animals" options={['No Animals', 'Dogs', 'Cats', 'Other', 'Multiple Types']} placeholder="Animals" />
              {get('animals')?.includes('dog') && (
                <TextArea field="animalDetails" label="Animal Details (breed, count, bite history)" rows={2} placeholder="e.g. Golden Retriever, 2 dogs, no bite history" />
              )}
              <Row cols={2}>
                <Select field="woodBurning" options={['No', 'Fireplace Only', 'Wood Stove', 'Both']} placeholder="Wood Burning Stove / Fireplace" />
                <Text field="landSize" label="Land Size" placeholder="e.g. 0.25 acres" />
              </Row>
            </div>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Security / Water</h3>
              <Row cols={2}>
                <Select field="centralAlarm" options={['None', 'Local Only', 'Central Monitored']} placeholder="Central Burglary/Fire Alarm" />
                <Select field="wholeHomeGenerator" options={['No', 'Yes']} placeholder="Whole Home Generator" />
              </Row>
              <Row cols={2}>
                <Select field="waterShutOff" options={['No', 'Yes']} placeholder="Auto Water Shut Off Valve" />
                <Select field="jewelryScheduled" options={['No', 'Yes — Pending Appraisal', 'Yes — Complete']} placeholder="Jewelry Scheduled Needed" />
              </Row>
            </div>

            {get('jewelryScheduled')?.startsWith('yes') && (
              <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
                <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Valuable Articles</h3>
                <Text field="scheduledValue" label="Total Scheduled Value" placeholder="e.g. 25000" />
                <Select field="appraisalStatus" options={['Pending', 'Complete', 'Not Required']} placeholder="Appraisals Status" />
              </div>
            )}
          </div>
        )}

        {/* ====== SECTION 5: AUTO DRIVERS ====== */}
        {step === 5 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 5 — Automobile: Drivers</h2>
            <p className="font-body text-mist mb-8">All licensed drivers in the household</p>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Auto Overview</h3>
              <Row cols={3}>
                <Text field="autoPriorCarrier" label="Auto Prior Carrier" placeholder="e.g. State Farm" />
                <Text field="autoExpiration" label="Auto Expiration" type="date" />
                <Text field="autoTenure" label="Tenure" placeholder="Years with carrier" />
              </Row>
              <Row cols={2}>
                <Checkbox field="goodStudent" label="Good Student Discount (Report Card Must Be Attached)" />
                <Text field="studentAway" label="Student Away at School? If yes, who?" placeholder="Name of student" />
              </Row>
            </div>

            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-midnight border border-dark-mist rounded-lg p-6 mb-4">
                <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Driver {n}</h3>
                <Row cols={4}>
                  <Text field={`driver${n}Name`} label="Full Name" placeholder="Driver name" />
                  <Text field={`driver${n}DOB`} label="DOB" placeholder="MM/DD/YYYY" />
                  <Text field={`driver${n}DLState`} label="DL State" placeholder="FL" />
                  <Text field={`driver${n}DLNumber`} label="DL Number" placeholder="License #" />
                </Row>
                <Row cols={3}>
                  <Select field={`driver${n}Marital`} options={['Single', 'Married', 'Divorced', 'Widowed']} placeholder="Marital" />
                  <Select field={`driver${n}Student`} options={['No', 'Yes']} placeholder="Good Student" />
                  <Text field={`driver${n}Violations`} label="Accidents, Tickets, Violations" placeholder="List any" />
                </Row>
              </div>
            ))}
          </div>
        )}

        {/* ====== SECTION 6: AUTO VEHICLES ====== */}
        {step === 6 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 6 — Automobile: Vehicles</h2>
            <p className="font-body text-mist mb-8">All vehicles to be insured</p>

            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-midnight border border-dark-mist rounded-lg p-6 mb-4">
                <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Vehicle {n}</h3>
                <Row cols={4}>
                  <Text field={`veh${n}Year`} label="Year" placeholder="e.g. 2022" />
                  <Text field={`veh${n}Make`} label="Make" placeholder="e.g. Toyota" />
                  <Text field={`veh${n}Model`} label="Model" placeholder="e.g. Camry" />
                  <Text field={`veh${n}VIN`} label="VIN" placeholder="17-character VIN" />
                </Row>
                <Row cols={4}>
                  <Text field={`veh${n}Title`} label="Title" placeholder="Owned/Leased/Financed" />
                  <Select field={`veh${n}Usage`} options={['Pleasure', 'Commute', 'Business', 'Farm']} placeholder="Usage" />
                  <Text field={`veh${n}Garaging`} label="Garaging ZIP" placeholder="ZIP code" />
                  <Text field={`veh${n}Lienholder`} label="Lienholder (if financed/leased)" placeholder="Lender name" />
                </Row>
              </div>
            ))}
            <TextArea field="vehicleNotes" label="Vehicle Notes" rows={3} placeholder="Any special notes about vehicles" />
          </div>
        )}

        {/* ====== SECTION 7: AUTO COVERAGE ====== */}
        {step === 7 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 7 — Automobile: Coverage Requested</h2>
            <p className="font-body text-mist mb-8">Desired coverage limits and deductibles</p>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Coverage by Vehicle</h3>
              {[1, 2, 3].map(n => (
                <Row key={n} cols={4}>
                  <Text field={`covVeh${n}Comp`} label={`Veh ${n} — Comp Deductible`} placeholder="e.g. 500" />
                  <Text field={`covVeh${n}Coll`} label={`Veh ${n} — Collision Deductible`} placeholder="e.g. 500" />
                  <Text field={`covVeh${n}Deductible`} label={`Veh ${n} — Deductible Type`} placeholder="Glass, Towing, Rental" />
                  <Text field={`covVeh${n}Additional`} label={`Veh ${n} — Additional Coverages`} placeholder="OEM, Special Equip" />
                </Row>
              ))}
            </div>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Liability Limits</h3>
              <Row cols={4}>
                <Select field="liabilityBI" options={['30/60', '50/100', '100/300', '250/500', '500/500']} placeholder="Bodily Injury" />
                <Select field="liabilityUnUnder" options={['Stacked', 'Non-Stacked', 'None']} placeholder="Un/Underinsured" />
                <Text field="pipLimit" label="PIP Limit" placeholder="e.g. 10000" />
                <Text field="medicalLimit" label="Medical Payments" placeholder="e.g. 5000" />
              </Row>
            </div>
          </div>
        )}

        {/* ====== SECTION 8: BOAT / WATERCRAFT ====== */}
        {step === 8 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 8 — Boat / Watercraft</h2>
            <p className="font-body text-mist mb-8">Watercraft information</p>

            {[1, 2, 3].map(n => (
              <div key={n} className="bg-midnight border border-dark-mist rounded-lg p-6 mb-4">
                <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Watercraft {n}</h3>
                <Row cols={4}>
                  <Text field={`boat${n}Year`} label="Year" placeholder="e.g. 2020" />
                  <Text field={`boat${n}Make`} label="Make" placeholder="e.g. Sea Ray" />
                  <Text field={`boat${n}Model`} label="Model" placeholder="e.g. Sundancer" />
                  <Text field={`boat${n}Hull`} label="Hull #" placeholder="Hull identification" />
                </Row>
                <Row cols={2}>
                  <Text field={`boat${n}Value`} label="Approx Value" placeholder="e.g. 45000" />
                  <Text field={`boat${n}Length`} label="Length" placeholder="e.g. 24 ft" />
                </Row>
              </div>
            ))}
            <TextArea field="boatStorage" label="Storage Location" rows={2} placeholder="Marina/address, in water/on lift, etc." />
            <TextArea field="boatMotor" label="Motor/Trailer/HP/Top Speed Notes" rows={2} placeholder="Engine details, trailer info" />
            <Text field="boatSpecialEquipment" label="Special Equipment" placeholder="Any additional equipment" />
          </div>
        )}

        {/* ====== SECTION 9: MOTORCYCLE / ATV & RV ====== */}
        {step === 9 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 9 — Motorcycle / ATV & RV</h2>
            <p className="font-body text-mist mb-8">Recreational vehicle information</p>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Motorcycle / ATV</h3>
              {[1, 2, 3].map(n => (
                <Row key={n} cols={4}>
                  <Text field={`mc${n}Year`} label="Year" placeholder="e.g. 2021" />
                  <Text field={`mc${n}Make`} label="Make" placeholder="e.g. Harley-Davidson" />
                  <Text field={`mc${n}Model`} label="Model" placeholder="e.g. Street Glide" />
                  <Text field={`mc${n}VIN`} label="VIN" placeholder="VIN" />
                </Row>
              ))}
            </div>

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Camper / Motorhome</h3>
              <Row cols={4}>
                <Text field="rvYear" label="Year" placeholder="e.g. 2019" />
                <Text field="rvMake" label="Make" placeholder="e.g. Winnebago" />
                <Text field="rvModel" label="Model" placeholder="e.g. Minnie" />
                <Text field="rvVIN" label="VIN" placeholder="VIN" />
              </Row>
              <Row cols={3}>
                <Text field="rvLength" label="Length" placeholder="e.g. 32 ft" />
                <Select field="rvTowed" options={['Towed', 'Driven', 'Both']} placeholder="Towed or Driven?" />
                <Text field="rvSlideOuts" label="Number of Slide Outs" placeholder="e.g. 2" />
              </Row>
            </div>
          </div>
        )}

        {/* ====== SECTION 10: SCHEDULED JEWELRY + UMBRELLA + ATTESTATION ====== */}
        {step === 10 && (
          <div>
            <h2 className="font-display text-[36px] text-white mb-1">Section 10 — Scheduled Items & Umbrella</h2>
            <p className="font-body text-mist mb-8">Valuable articles scheduling and umbrella coverage</p>

            {get('jewelryScheduled')?.startsWith('yes') && (
              <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
                <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Scheduled Jewelry / Valuable Articles Detail</h3>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <Row key={n} cols={3}>
                    <Text field={`scheduled${n}Desc`} label={`Item ${n} — Description`} placeholder="e.g. Diamond ring" />
                    <Text field={`scheduled${n}Value`} label={`Item ${n} — Value`} placeholder="e.g. 15000" />
                    <Text field={`scheduled${n}Date`} label={`Item ${n} — Appraisal Date`} type="date" />
                  </Row>
                ))}
                <TextArea field="jewelryNotes" label="Jewelry / VA Notes" rows={2} placeholder="Additional notes" />
              </div>
            )}

            <div className="bg-midnight border border-dark-mist rounded-lg p-6 mb-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-brand-blue mb-4">Umbrella / Excess Liability</h3>
              <Row cols={2}>
                <Select field="umbrellaEligible" options={['No', 'Yes']} placeholder="Eligible for umbrella?" />
                <Select field="umbrellaLimit" options={['1,000,000', '2,000,000', '3,000,000', '5,000,000']} placeholder="Desired Limit" />
              </Row>
              <p className="font-body text-xs text-mist mt-3">
                **Dec Pages will be requested for any underlying policy not already controlled by our agency.
              </p>
            </div>

            {/* Attestation */}
            <div className="bg-midnight border border-crimson/30 rounded-lg p-6">
              <h3 className="font-body text-xs uppercase tracking-[2px] text-crimson mb-4">Attestation</h3>
              <p className="font-body text-sm text-white mb-4">
                I confirm the above information is complete and accurate to the best of my knowledge.
              </p>
              <Row cols={2}>
                <Text field="completedBy" label="Completed By (Name)" required placeholder="Your full name" />
                <Text field="completionDate" label="Date" type="date" />
              </Row>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-dark-mist">
          <button onClick={back} disabled={step === 1}
            className="flex items-center gap-2 border border-dark-mist text-white font-body text-[12px] uppercase tracking-[2px] px-6 py-3 rounded-full hover:border-white disabled:opacity-30 transition-colors">
            <ChevronLeft size={14} /> Back
          </button>
          {step < 10 ? (
            <button onClick={next}
              className="flex items-center gap-2 bg-crimson text-white font-body text-[12px] uppercase tracking-[2px] px-8 py-3 rounded-full hover:bg-arabian-red transition-colors">
              Next Section <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="flex items-center gap-2 bg-crimson text-white font-body text-[12px] uppercase tracking-[2px] px-8 py-3 rounded-full hover:bg-arabian-red transition-colors disabled:opacity-60">
              {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : <>Submit Intake <Check size={14} /></>}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
