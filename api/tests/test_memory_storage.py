from __future__ import annotations

from storage.memory import MemoryLeadStorage


def test_save_appends_lead():
    store = MemoryLeadStorage()

    store.save({"name": "Ana"})
    store.save({"name": "Beto"})

    assert store.leads == [{"name": "Ana"}, {"name": "Beto"}]


def test_leads_property_returns_a_copy():
    store = MemoryLeadStorage()
    store.save({"name": "Ana"})

    leads = store.leads
    leads.append({"name": "Injected"})

    assert store.leads == [{"name": "Ana"}]
